export const SITE = {
  website: "https://start-up.engineering", // replace this with your deployed domain
  author: "Chinmay",
  profile: "https://www.linkedin.com/in/chinmay-pandey/",
  desc: "Unlock the power of AWS to build, scale, and secure your startup with actionable insights and expert advice.",
  title: "Startup Engineering",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/hionnode/startup-engineering-blog/edit/main/",
  },
  dynamicOgImage: true,
} as const;
