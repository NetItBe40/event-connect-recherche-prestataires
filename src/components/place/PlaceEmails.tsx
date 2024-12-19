interface PlaceEmailsProps {
  email_1?: string;
  email_2?: string;
}

export function PlaceEmails({ email_1, email_2 }: PlaceEmailsProps) {
  if (!email_1 && !email_2) return null;

  return (
    <div>
      <strong>Emails :</strong>
      <div className="mt-1 space-y-1">
        {email_1 && (
          <p><strong>Email 1 :</strong> {email_1}</p>
        )}
        {email_2 && (
          <p><strong>Email 2 :</strong> {email_2}</p>
        )}
      </div>
    </div>
  );
}