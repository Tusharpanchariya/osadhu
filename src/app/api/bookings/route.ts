import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import nodemailer from "nodemailer";

// Helper to generate unique booking reference ID
function generateBookingReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "OS-";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// GET handler: Fetch bookings & blocked dates for calendar rendering
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      // Mock data for preview mode
      const today = new Date();
      const format = (d: Date) => d.toISOString().split("T")[0];
      
      const mockBookings = [
        {
          start_date: format(new Date(today.getFullYear(), today.getMonth(), 8)),
          end_date: format(new Date(today.getFullYear(), today.getMonth(), 12)),
          booking_type: "range",
        },
        {
          start_date: format(new Date(today.getFullYear(), today.getMonth(), 22)),
          end_date: format(new Date(today.getFullYear(), today.getMonth(), 22)),
          booking_type: "single",
          time_slot: "09:00 AM - 03:00 PM"
        }
      ];

      const mockBlocked = [
        { date: format(new Date(today.getFullYear(), today.getMonth(), 2)) },
        { date: format(new Date(today.getFullYear(), today.getMonth(), 3)) }
      ];

      return NextResponse.json({ bookings: mockBookings, blocked: mockBlocked, mock: true });
    }

    // Try query with new schema
    const bookingsResponse = await supabaseAdmin
      .from("bookings")
      .select("start_date, end_date, booking_type, time_slot")
      .eq("status", "confirmed");

    let bookings = bookingsResponse.data;

    // Fallback if schema doesn't have booking_type or time_slot yet
    if (bookingsResponse.error) {
      console.warn("New schema columns not found, falling back to legacy select:", bookingsResponse.error.message);
      
      const fallbackResponse = await supabaseAdmin
        .from("bookings")
        .select("start_date, end_date")
        .neq("status", "cancelled");
      
      if (fallbackResponse.error) {
        throw fallbackResponse.error;
      }
      
      // Map legacy select entries to new schema structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bookings = (fallbackResponse.data || []).map((b: any) => ({
        start_date: b.start_date,
        end_date: b.end_date,
        booking_type: "range",
        time_slot: null
      }));
    }

    // Query blocked dates
    const { data: blocked, error: blockedError } = await supabaseAdmin
      .from("blocked_dates")
      .select("date, reason");

    const activeBlocked = blockedError ? [] : (blocked || []);

    return NextResponse.json({ bookings, blocked: activeBlocked });
  } catch (error: unknown) {
    console.error("Error in GET /api/bookings:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST handler: Verify, save, and confirm booking
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      booking_type, 
      start_date, 
      end_date, 
      time_slot, 
      payment_method, 
      payment_status, 
      payment_id,
      // Optional fields
      instagram_url,
      spotify_url,
      youtube_url,
      soundcloud_url,
      website_url,
      phone_number,
      project_artist_name,
      message_notes
    } = body;

    // Validation
    if (!name || !email || !booking_type || !start_date || !end_date) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (start_date < todayStr) {
      return NextResponse.json({ error: "Cannot book dates in the past" }, { status: 400 });
    }

    const calculatedStart = new Date(start_date);
    const calculatedEnd = new Date(end_date);
    const totalDays = Math.max(1, Math.round((calculatedEnd.getTime() - calculatedStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const bookingRef = generateBookingReference();

    const configured = isSupabaseConfigured();

    const optionalData = {
      instagram_url: instagram_url || null,
      spotify_url: spotify_url || null,
      youtube_url: youtube_url || null,
      soundcloud_url: soundcloud_url || null,
      website_url: website_url || null,
      phone_number: phone_number || null,
      project_artist_name: project_artist_name || null,
      message_notes: message_notes || null
    };

    if (!configured) {
      console.warn("Supabase not configured. Simulating successful mock booking & emails.");
      await sendEmails(
        name, 
        email, 
        bookingRef, 
        booking_type, 
        start_date, 
        end_date, 
        time_slot || "", 
        totalDays, 
        payment_method, 
        payment_status || "paid",
        optionalData
      );
      return NextResponse.json({
        success: true,
        message: "Mock booking created successfully!",
        booking: {
          booking_reference: bookingRef,
          name,
          email,
          booking_type,
          start_date,
          end_date,
          time_slot,
          total_days: totalDays,
          payment_method,
          payment_status: payment_status || "paid",
          payment_id,
          ...optionalData
        },
        mock: true
      });
    }

    // 1. Verification of Availability (overlap prevention)
    // Run availability check dynamically
    const { data: activeBookings, error: fetchErr } = await supabaseAdmin
      .from("bookings")
      .select("start_date, end_date, booking_type, time_slot")
      .eq("status", "confirmed");

    const currentBookings = fetchErr ? [] : (activeBookings || []);

    if (booking_type === "single") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isBooked = currentBookings.some((b: any) => {
        return b.start_date === start_date && b.time_slot === time_slot;
      });
      if (isBooked) {
        return NextResponse.json({ error: "The selected time slot is already reserved.", code: "DOUBLE_BOOKING" }, { status: 400 });
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isOverlap = currentBookings.some((b: any) => {
        return b.start_date <= end_date && b.end_date >= start_date;
      });
      if (isOverlap) {
        return NextResponse.json({ error: "One or more dates in your selected range are already reserved.", code: "DOUBLE_BOOKING" }, { status: 400 });
      }
    }

    // 2. Insert into database
    const insertResponse = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          name,
          email,
          booking_type,
          start_date,
          end_date,
          time_slot: booking_type === "single" ? time_slot : null,
          total_days: totalDays,
          payment_method,
          payment_status: payment_status || "paid",
          payment_id,
          booking_reference: bookingRef,
          status: "confirmed",
          ...optionalData
        }
      ])
      .select()
      .single();

    // Fallback insert if columns do not exist yet on legacy schema
    if (insertResponse.error && insertResponse.error.message.includes("column")) {
      console.warn("New columns missing, falling back to legacy schema insertion:", insertResponse.error.message);
      
      const legacyInsert = await supabaseAdmin
        .from("bookings")
        .insert([
          {
            name,
            email,
            artist_name: project_artist_name || name,
            start_date,
            end_date,
            package: booking_type === "single" ? "5-day" : `${totalDays}-day`,
            status: "confirmed"
          }
        ])
        .select()
        .single();
      
      if (legacyInsert.error) {
        return NextResponse.json({ 
          error: `Database schema mismatch: ${legacyInsert.error.message}. Please execute the SQL queries in supabase_schema.sql in your Supabase SQL editor.`,
          code: "SCHEMA_MISMATCH" 
        }, { status: 400 });
      }

      await sendEmails(
        name, 
        email, 
        bookingRef, 
        booking_type, 
        start_date, 
        end_date, 
        time_slot || "", 
        totalDays, 
        payment_method, 
        payment_status || "paid",
        optionalData
      );

      return NextResponse.json({
        success: true,
        message: "Booking confirmed successfully (Legacy Mode)!",
        booking: {
          booking_reference: bookingRef,
          name,
          email,
          booking_type,
          start_date,
          end_date,
          total_days: totalDays,
          payment_method,
          payment_status: "paid"
        }
      });
    }

    if (insertResponse.error) throw insertResponse.error;

    // 3. Send Confirmation Emails
    await sendEmails(
      name, 
      email, 
      bookingRef, 
      booking_type, 
      start_date, 
      end_date, 
      time_slot || "", 
      totalDays, 
      payment_method, 
      payment_status || "paid",
      optionalData
    );

    return NextResponse.json({
      success: true,
      message: "Booking confirmed successfully!",
      booking: insertResponse.data
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/bookings:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Nodemailer Helper to send email confirmation & admin alerts
async function sendEmails(
  name: string,
  email: string,
  bookingRef: string,
  bookingType: string,
  startDate: string,
  endDate: string,
  timeSlot: string,
  totalDays: number,
  paymentMethod: string,
  paymentStatus: string,
  optionalData: {
    instagram_url: string | null;
    spotify_url: string | null;
    youtube_url: string | null;
    soundcloud_url: string | null;
    website_url: string | null;
    phone_number: string | null;
    project_artist_name: string | null;
    message_notes: string | null;
  }
) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || "Osadho Records <shoorasena.osadho@gmail.com>";
  const adminEmail = process.env.EMAIL_ADMIN || "shoorasena.osadho@gmail.com";

  if (!host || !user || !pass) {
    console.warn("SMTP credentials not configured. Skipping email dispatch.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const dateDetails = bookingType === "single"
    ? `<strong>Date:</strong> ${startDate}<br/><strong>Time Slot:</strong> ${timeSlot}`
    : `<strong>Dates:</strong> ${startDate} to ${endDate} (${totalDays} Days)`;

  // Client Email Content
  const clientHtml = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; background-color: #F5F0E8; color: #0D0D0D; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-family: Georgia, serif; color: #1E372D; margin: 0; font-size: 24px; letter-spacing: 0.1em; text-transform: uppercase;">Osadho Records</h2>
        <p style="color: #C6A56B; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 5px;">Harsil Valley, Himalayas</p>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; border: 1px solid rgba(198, 165, 107, 0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Dear ${name},</p>
        <p style="font-size: 15px; line-height: 1.6;">Your booking at Osadho Records has been successfully confirmed. Your selected dates have been reserved.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #7A624B; text-transform: uppercase; width: 140px;">Booking Ref</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #1E372D;">${bookingRef}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #7A624B; text-transform: uppercase;">Booking Type</td>
            <td style="padding: 8px 0; font-size: 14px;">${bookingType === "single" ? "Single Day Session" : "Residency / Multi-Day"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #7A624B; text-transform: uppercase;">Details</td>
            <td style="padding: 8px 0; font-size: 14px;">${dateDetails}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; font-size: 13px; color: #7A624B; text-transform: uppercase;">Payment Status</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #1E372D;">${paymentStatus.toUpperCase()} (${paymentMethod})</td>
          </tr>
        </table>

        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 13px; color: #777; line-height: 1.6; margin: 0;">We are preparing the sanctuary for your arrival. If you have any questions or custom requirements, please do not hesitate to contact us.</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 25px; color: #7A624B; font-size: 11px; letter-spacing: 0.1em;">
        &copy; ${new Date().getFullYear()} Osadho Records. All rights reserved.
      </div>
    </div>
  `;

  // Admin Email Content
  const adminHtml = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; background-color: #0D0D0D; color: #F5F0E8; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-family: Georgia, serif; color: #C6A56B; margin: 0; font-size: 22px; letter-spacing: 0.1em;">CONFIRMED BOOKING ALERT</h2>
        <p style="color: #ffffff; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 5px;">Osadho Records Portal</p>
      </div>
      <div style="background-color: #141414; padding: 30px; border-radius: 6px; border: 1px solid rgba(198, 165, 107, 0.15);">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; color: #F5F0E8;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B; width: 140px;">Booking Ref</td>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">${bookingRef}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Name</td>
            <td style="padding: 8px 0;">${name} (${email})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Type</td>
            <td style="padding: 8px 0;">${bookingType === "single" ? "Single Day Session" : "Residency / Multi-Day"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Dates / Slot</td>
            <td style="padding: 8px 0;">${bookingType === "single" ? `${startDate} [${timeSlot}]` : `${startDate} to ${endDate} (${totalDays} Days)`}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Payment Method</td>
            <td style="padding: 8px 0;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Payment Status</td>
            <td style="padding: 8px 0; font-weight: bold; color: #22c55e;">${paymentStatus.toUpperCase()}</td>
          </tr>
          
          <!-- Optional Fields -->
          ${optionalData.project_artist_name ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Artist/Project</td>
            <td style="padding: 8px 0;">${optionalData.project_artist_name}</td>
          </tr>` : ""}
          ${optionalData.phone_number ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Phone</td>
            <td style="padding: 8px 0;">${optionalData.phone_number}</td>
          </tr>` : ""}
          ${optionalData.instagram_url ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Instagram</td>
            <td style="padding: 8px 0;"><a href="${optionalData.instagram_url}" style="color: #C6A56B;">${optionalData.instagram_url}</a></td>
          </tr>` : ""}
          ${optionalData.spotify_url ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Spotify</td>
            <td style="padding: 8px 0;"><a href="${optionalData.spotify_url}" style="color: #C6A56B;">${optionalData.spotify_url}</a></td>
          </tr>` : ""}
          ${optionalData.youtube_url ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">YouTube</td>
            <td style="padding: 8px 0;"><a href="${optionalData.youtube_url}" style="color: #C6A56B;">${optionalData.youtube_url}</a></td>
          </tr>` : ""}
          ${optionalData.soundcloud_url ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">SoundCloud</td>
            <td style="padding: 8px 0;"><a href="${optionalData.soundcloud_url}" style="color: #C6A56B;">${optionalData.soundcloud_url}</a></td>
          </tr>` : ""}
          ${optionalData.website_url ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #C6A56B;">Website</td>
            <td style="padding: 8px 0;"><a href="${optionalData.website_url}" style="color: #C6A56B;">${optionalData.website_url}</a></td>
          </tr>` : ""}
        </table>
        
        ${optionalData.message_notes ? `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
          <h4 style="color: #C6A56B; margin: 0 0 10px 0;">Notes / Goals:</h4>
          <p style="font-size: 13px; line-height: 1.6; color: #ccc; margin: 0; white-space: pre-line;">${optionalData.message_notes}</p>
        </div>` : ""}
      </div>
    </div>
  `;

  // Send client mail
  await transporter.sendMail({
    from,
    to: email,
    subject: `Booking Confirmed: ${bookingRef} - Osadho Records`,
    html: clientHtml,
  });

  // Send admin mail
  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `CONFIRMED: Booking Alert - ${bookingRef} (${name})`,
    html: adminHtml,
  });
}
