import { useEffect, useState } from "react";

export default function About() {
  const [about, setAbout] = useState<string>("Loading...");

  useEffect(() => {
    fetch("/about")
      .then(res => res.text())
      .then(setAbout)
      .catch(() => setAbout("Unable to load About section."));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 prose prose-lg">
      <div dangerouslySetInnerHTML={{ __html: about }} />
    </div>
  );
}