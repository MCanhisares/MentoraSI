import { Resend } from "resend";

// Resend requires a verified domain. Use their test domain for development.
const DEFAULT_FROM = "MentoraSI <onboarding@resend.dev>";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured - emails will not be sent");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromAddress(): string {
  const from = process.env.EMAIL_FROM;
  // Check if it's a valid Resend sender (not gmail.com or other unverified domains)
  if (from && !from.includes("gmail.com") && !from.includes("hotmail.com") && !from.includes("yahoo.com")) {
    return from;
  }
  return DEFAULT_FROM;
}

export async function sendBookingConfirmationToStudent(
  studentEmail: string,
  sessionDetails: {
    studentName: string;
    date: string;
    startTime: string;
    endTime: string;
    meetingLink: string | null;
    sessionId: string;
    managementToken: string;
    baseUrl: string;
  }
) {
  const resend = getResendClient();
  if (!resend) return;

  const { studentName, date, startTime, endTime, meetingLink, sessionId, managementToken, baseUrl } = sessionDetails;

  const rescheduleLink = `${baseUrl}/sessao/${sessionId}/reagendar?token=${managementToken}`;
  const cancelLink = `${baseUrl}/sessao/${sessionId}/cancelar?token=${managementToken}`;

  const result = await resend.emails.send({
    from: getFromAddress(),
    to: studentEmail,
    subject: "Sua Sessão de Mentoria está Confirmada!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px; border-radius: 12px;">
        <h1 style="color: #3b82f6; margin-bottom: 24px;">Sessão Confirmada!</h1>
        <p style="margin-bottom: 16px;">Olá ${studentName},</p>
        <p style="margin-bottom: 24px;">Sua sessão de mentoria foi agendada com sucesso.</p>

        <div style="background: #1c1c1c; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #262626;">
          <p style="margin: 8px 0;"><strong>Data:</strong> ${date}</p>
          <p style="margin: 8px 0;"><strong>Horário:</strong> ${startTime} - ${endTime}</p>
          ${meetingLink ? `<p style="margin: 8px 0;"><strong>Link da Reunião:</strong> <a href="${meetingLink}" style="color: #3b82f6;">${meetingLink}</a></p>` : ""}
        </div>

        <p style="margin-bottom: 24px;">Você se encontrará com um mentor alumni. A identidade do mentor será revelada durante a sessão.</p>

        <div style="background: #141414; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #262626;">
          <p style="margin-bottom: 12px; color: #9ca3af;">Precisa fazer alterações?</p>
          <a href="${rescheduleLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-right: 12px;">Reagendar</a>
          <a href="${cancelLink}" style="display: inline-block; background: transparent; color: #ef4444; padding: 10px 20px; border-radius: 6px; text-decoration: none; border: 1px solid #ef4444;">Cancelar</a>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
          Obrigado por usar o MentoraSI!
        </p>
      </div>
    `,
  });

  if (result.error) {
    console.error("Resend error (student confirmation):", result.error);
    throw new Error(result.error.message);
  }
  console.log("Student confirmation email sent:", result.data?.id);
}

export async function sendBookingNotificationToAlumni(
  alumniEmail: string,
  sessionDetails: {
    date: string;
    startTime: string;
    endTime: string;
    studentEmail: string;
    studentName: string;
    studentLinkedin: string | null;
    studentNotes: string | null;
    meetingLink: string | null;
    sessionId: string;
    managementToken: string;
    baseUrl: string;
  }
) {
  const resend = getResendClient();
  if (!resend) return;

  const {
    date,
    startTime,
    endTime,
    studentEmail,
    studentName,
    studentLinkedin,
    studentNotes,
    meetingLink,
    sessionId,
    managementToken,
    baseUrl,
  } = sessionDetails;

  const cancelLink = `${baseUrl}/sessao/${sessionId}/cancelar?token=${managementToken}`;

  const result = await resend.emails.send({
    from: getFromAddress(),
    to: alumniEmail,
    subject: `Nova Sessão de Mentoria - ${studentName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px; border-radius: 12px;">
        <h1 style="color: #3b82f6; margin-bottom: 24px;">Nova Sessão Agendada!</h1>
        <p style="margin-bottom: 24px;">Um estudante agendou uma sessão de mentoria com você.</p>

        <div style="background: #1c1c1c; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #262626;">
          <p style="margin: 8px 0;"><strong>Data:</strong> ${date}</p>
          <p style="margin: 8px 0;"><strong>Horário:</strong> ${startTime} - ${endTime}</p>
          ${meetingLink ? `<p style="margin: 8px 0;"><strong>Link da Reunião:</strong> <a href="${meetingLink}" style="color: #3b82f6;">${meetingLink}</a></p>` : ""}
        </div>

        <div style="background: #141414; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #262626;">
          <h3 style="color: #ededed; margin-top: 0; margin-bottom: 16px;">Sobre o Estudante</h3>
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${studentName}</p>
          <p style="margin: 8px 0;"><strong>E-mail:</strong> <a href="mailto:${studentEmail}" style="color: #3b82f6;">${studentEmail}</a></p>
          ${studentLinkedin ? `<p style="margin: 8px 0;"><strong>LinkedIn:</strong> <a href="${studentLinkedin}" style="color: #3b82f6;">${studentLinkedin}</a></p>` : ""}
          ${studentNotes ? `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #262626;">
              <p style="margin: 0 0 8px 0; color: #9ca3af;"><strong>O que o estudante gostaria de discutir:</strong></p>
              <p style="margin: 0; white-space: pre-wrap;">${studentNotes}</p>
            </div>
          ` : ""}
        </div>

        <p style="margin-bottom: 16px;">Um evento foi criado automaticamente no seu Google Calendar.</p>

        <div style="margin: 24px 0;">
          <a href="${cancelLink}" style="display: inline-block; background: transparent; color: #ef4444; padding: 10px 20px; border-radius: 6px; text-decoration: none; border: 1px solid #ef4444;">Cancelar Sessão</a>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
          Obrigado por ser um mentor no MentoraSI!
        </p>
      </div>
    `,
  });

  if (result.error) {
    console.error("Resend error (alumni notification):", result.error);
    throw new Error(result.error.message);
  }
  console.log("Alumni notification email sent:", result.data?.id);
}

export async function sendCancellationNotification(
  recipientEmail: string,
  sessionDetails: {
    recipientName: string;
    studentName: string;
    date: string;
    startTime: string;
    endTime: string;
    cancelledBy: "student" | "alumni";
    reason?: string | null;
  }
) {
  const resend = getResendClient();
  if (!resend) return;

  const { recipientName, studentName, date, startTime, endTime, cancelledBy, reason } = sessionDetails;

  const cancelledByText = cancelledBy === "student" ? "o estudante" : "o mentor";

  const result = await resend.emails.send({
    from: getFromAddress(),
    to: recipientEmail,
    subject: "Sessão de Mentoria Cancelada",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px; border-radius: 12px;">
        <h1 style="color: #ef4444; margin-bottom: 24px;">Sessão Cancelada</h1>
        <p style="margin-bottom: 16px;">Olá ${recipientName},</p>
        <p style="margin-bottom: 24px;">Infelizmente, sua sessão de mentoria foi cancelada por ${cancelledByText}.</p>

        <div style="background: #1c1c1c; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #262626;">
          <p style="margin: 8px 0;"><strong>Estudante:</strong> ${studentName}</p>
          <p style="margin: 8px 0;"><strong>Data:</strong> ${date}</p>
          <p style="margin: 8px 0;"><strong>Horário:</strong> ${startTime} - ${endTime}</p>
          ${reason ? `<p style="margin: 16px 0 0 0;"><strong>Motivo:</strong> ${reason}</p>` : ""}
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
          Esperamos que você possa agendar uma nova sessão em breve!
        </p>
      </div>
    `,
  });

  if (result.error) {
    console.error("Resend error (cancellation):", result.error);
    throw new Error(result.error.message);
  }
  console.log("Cancellation email sent:", result.data?.id);
}

export async function sendRescheduleNotification(
  recipientEmail: string,
  sessionDetails: {
    recipientName: string;
    studentName: string;
    oldDate: string;
    oldStartTime: string;
    oldEndTime: string;
    newDate: string;
    newStartTime: string;
    newEndTime: string;
    meetingLink: string | null;
    rescheduleLink?: string;
    cancelLink?: string;
  }
) {
  const resend = getResendClient();
  if (!resend) return;

  const {
    recipientName,
    studentName,
    oldDate,
    oldStartTime,
    oldEndTime,
    newDate,
    newStartTime,
    newEndTime,
    meetingLink,
    rescheduleLink,
    cancelLink,
  } = sessionDetails;

  const result = await resend.emails.send({
    from: getFromAddress(),
    to: recipientEmail,
    subject: "Sessão de Mentoria Reagendada",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px; border-radius: 12px;">
        <h1 style="color: #3b82f6; margin-bottom: 24px;">Sessão Reagendada</h1>
        <p style="margin-bottom: 16px;">Olá ${recipientName},</p>
        <p style="margin-bottom: 24px;">Sua sessão de mentoria com ${studentName} foi reagendada.</p>

        <div style="background: #1c1c1c; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #262626;">
          <p style="margin: 0 0 16px 0; color: #9ca3af; text-decoration: line-through;">
            <strong>Antes:</strong> ${oldDate} às ${oldStartTime} - ${oldEndTime}
          </p>
          <p style="margin: 0;"><strong>Novo horário:</strong> ${newDate} às ${newStartTime} - ${newEndTime}</p>
          ${meetingLink ? `<p style="margin: 16px 0 0 0;"><strong>Link da Reunião:</strong> <a href="${meetingLink}" style="color: #3b82f6;">${meetingLink}</a></p>` : ""}
        </div>

        ${rescheduleLink && cancelLink ? `
          <div style="background: #141414; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #262626;">
            <p style="margin-bottom: 12px; color: #9ca3af;">Precisa fazer alterações?</p>
            <a href="${rescheduleLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-right: 12px;">Reagendar</a>
            <a href="${cancelLink}" style="display: inline-block; background: transparent; color: #ef4444; padding: 10px 20px; border-radius: 6px; text-decoration: none; border: 1px solid #ef4444;">Cancelar</a>
          </div>
        ` : ""}

        <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
          Obrigado por usar o MentoraSI!
        </p>
      </div>
    `,
  });

  if (result.error) {
    console.error("Resend error (reschedule):", result.error);
    throw new Error(result.error.message);
  }
  console.log("Reschedule email sent:", result.data?.id);
}
