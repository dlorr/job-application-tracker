export const getJobLinkLabel = (url: string) => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("linkedin.com")) return "LinkedIn";
    if (hostname.includes("jobstreet.com")) return "JobStreet";
    if (hostname.includes("google.com")) return "Google Careers";

    return "Go to Job Link";
  } catch {
    return "Go to Job Link";
  }
};
