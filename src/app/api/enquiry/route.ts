import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Store in Supabase
    const { error: dbError } = await supabase
      .from("residency_enquiries")
      .insert([
        {
          artist_name: data.artistName,
          contact_person: data.contactPerson,
          email: data.email,
          phone: data.phone,
          instagram_url: data.instagram,
          country: data.country,
          city: data.city,
          website: data.website,
          streaming_link: data.streamingLink,
          project_description: data.projectDescription,
          services: data.services,
          instruments: data.instruments,
          microphones: data.microphones,
          studio_recommendation: data.studioRecommendation,
          facilities: data.facilities,
          accommodation: data.accommodation,
          notes: data.notes,
          start_date: data.startDate,
          end_date: data.endDate,
          total_days: data.totalDays,
          status: 'pending'
        }
      ]);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

    // 2. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailFrom = process.env.EMAIL_FROM || "Osadho Records <hello@osadhorecords.com>";
    const emailAdmin = process.env.EMAIL_ADMIN || process.env.SMTP_USER;

    // 3. Email to Admin
    const adminHtml = `
      <h2>New Artist Residency Enquiry</h2>
      <p><strong>Artist:</strong> ${data.artistName}</p>
      <p><strong>Contact:</strong> ${data.contactPerson}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Location:</strong> ${data.city}, ${data.country}</p>
      
      <h3>Residency Dates</h3>
      <p><strong>From:</strong> ${data.startDate} <strong>To:</strong> ${data.endDate} (${data.totalDays} Days)</p>
      
      <h3>Project Description</h3>
      <p>${data.projectDescription}</p>
      
      <h3>Requirements</h3>
      <p><strong>Services:</strong> ${data.services.join(", ") || "None"}</p>
      <p><strong>Instruments:</strong> ${data.instruments.join(", ") || "None"} ${data.otherInstrument ? `(Other: ${data.otherInstrument})` : ""}</p>
      <p><strong>Microphones:</strong> ${data.studioRecommendation ? "Studio Recommendation" : data.microphones.join(", ") || "None"}</p>
      <p><strong>Facilities:</strong> ${data.facilities.join(", ") || "None"}</p>
      <p><strong>Accommodation:</strong> ${data.accommodation.join(", ") || "None"}</p>
      
      <h3>Additional Notes</h3>
      <p>${data.notes || "None"}</p>
    `;

    await transporter.sendMail({
      from: emailFrom,
      to: emailAdmin,
      subject: `New Residency Enquiry from ${data.artistName}`,
      html: adminHtml,
    });

    // 4. Auto Confirmation Email to User
    const userHtml = `
      <p>Hi ${data.contactPerson || data.artistName},</p>
      <p>Thank you for your interest in an Artist Residency at Osadhu Studio.</p>
      <p>We have successfully received your enquiry and appreciate you taking the time to share your project with us.</p>
      <p>Our team will carefully review your application, residency dates, and studio requirements. We aim to respond within 2–5 business days with availability and the next steps.</p>
      <p>If we need any additional information, we'll reach out using the contact details you provided.</p>
      <p>We look forward to learning more about your music and the possibility of creating something meaningful together.</p>
      <br/>
      <p>Warm regards,</p>
      <p>The Osadhu Studio Team</p>
    `;

    await transporter.sendMail({
      from: emailFrom,
      to: data.email,
      subject: "We've Received Your Residency Enquiry",
      html: userHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
