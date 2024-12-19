interface PlaceSocialMediaProps {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  pinterest?: string;
}

export function PlaceSocialMedia(props: PlaceSocialMediaProps) {
  const hasSocialMedia = Object.values(props).some(value => value);

  if (!hasSocialMedia) return null;

  return (
    <div>
      <strong>Réseaux sociaux :</strong>
      <div className="mt-1 space-y-1">
        {props.facebook && (
          <p><strong>Facebook :</strong> {props.facebook}</p>
        )}
        {props.instagram && (
          <p><strong>Instagram :</strong> {props.instagram}</p>
        )}
        {props.tiktok && (
          <p><strong>TikTok :</strong> {props.tiktok}</p>
        )}
        {props.snapchat && (
          <p><strong>Snapchat :</strong> {props.snapchat}</p>
        )}
        {props.twitter && (
          <p><strong>Twitter :</strong> {props.twitter}</p>
        )}
        {props.linkedin && (
          <p><strong>LinkedIn :</strong> {props.linkedin}</p>
        )}
        {props.github && (
          <p><strong>GitHub :</strong> {props.github}</p>
        )}
        {props.youtube && (
          <p><strong>YouTube :</strong> {props.youtube}</p>
        )}
        {props.pinterest && (
          <p><strong>Pinterest :</strong> {props.pinterest}</p>
        )}
      </div>
    </div>
  );
}