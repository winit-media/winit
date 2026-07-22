export interface SiteContent {
  // Navbar
  logoUrl: string;
  navLinks: { label: string; href: string; description?: string }[];

  // Hero
  heroHeading: string;
  heroSubtext: string;
  heroCtaText: string;

  // What We Do
  whatWeDoTitle: string;
  services: {
    sub: string;
    content: string;
    bg: string;
  }[];

  // Media Carousel
  carouselTitle: string;

  // Brand Showcase
  brandTitle: string;

  // Why Choose Us
  whyChooseUsTitle: string;
  stats: { number: number; suffix: string; label: string }[];
  reasons: { title: string; desc: string }[];

  // Testimonials
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: {
    id: string;
    name: string;
    designation: string;
    company: string;
    service: string;
    review: string;
    website: string;
    logoUrl: string;
  }[];

  // Footer
  footerTitle: string;
  footerTagline: string;
  footerQuickLinksTitle: string;
  footerQuickLinks: { label: string; href: string; description?: string }[];
  footerContactTitle: string;
  contactPhone: string;
  contactAddress: string;
  contactEmail: string;
  socialLinks: { label: string; href: string }[];
  footerCopyright: string;

  // Brands
  brands: { id: string; name: string; imageUrl: string; link?: string }[];

  // Videos
  defaultVideoUrl: string;
  carouselVideos: { id: string; name: string; url: string }[];

  // Blog Users
  blogUsers: { email: string; displayName: string }[];

  // Page Metadata
  pageTitle: string;
  pageDescription: string;
}

export const SITE_LOGO_URL = "https://winitmedia.com/logo.png";

export const defaultSiteContent: SiteContent = {
  logoUrl: "/logo.png",
  navLinks: [
    { label: "Home", href: "#home", description: "WinIt Media homepage" },
    { label: "Services", href: "#services", description: "Our influencer marketing and brand services" },
    { label: "Work", href: "#work", description: "Featured campaigns and portfolio" },
    { label: "Blogs", href: "/blogs", description: "Insights and updates from WinIt" },
    { label: "Contact", href: "#contact", description: "Get in touch with our team" },
  ],

  heroHeading: "SHAPING SUCCESS STORIES",
  heroSubtext:
    "We believe every brand has a unique story waiting to be told. Our mission is to transform those stories into powerful narratives that drive success. By connecting your brand with the right audience, we ensure your message isn't just heard, but truly remembered. Let's craft your story together and make it unforgettable.",
  heroCtaText: "Connect Now",

  whatWeDoTitle: "What we do",
  services: [
    {
      sub: "Influencer Marketing",
      content:
        "We specialize in crafting potent campaigns that link brands with the perfect influencers to promote their products or services effectively. Our strategic approach ensures we select influencers tailored to your target market and goals.",
      bg: "bg-blue-500",
    },
    {
      sub: "Celebrity Endorsement",
      content:
        "We connect your brand with top celebrities for authentic endorsements that boost credibility and expand reach. Let's make your brand shine with star power!",
      bg: "bg-red-500",
    },
    {
      content: "We create engaging podcasts that amplify your brand's voice. Through compelling storytelling and expert insights, we connect you with your audience authentically. Let's bring your brand to life through audio!",
      bg: "bg-purple-400",
      sub: "Podcast",
    },
    {
      sub: "User Generated Content",
      content: "We leverage user-generated content to boost trust and engagement. Partnering with creators, we craft authentic content that resonates with your audience. Let's amplify your brand's impact!",
      bg: "bg-pink-400",
    },
    {
      sub: "Talent Management",
      content: "We manage talent to elevate your brand's presence. From collaborations to career growth, we connect influencers and brands for impactful partnerships. Let's build success together!",
      bg: "bg-orange-400",
    },
    {
      content: "We craft tailored strategies that align with your brand's goals and audience. With industry insights, striking visuals, and compelling stories, we create lasting impact. Let's make your brand unforgettable!",
      bg: "bg-green-400",
      sub: "Creative Strategy",
    },
    {
      bg: "bg-yellow-400",
      content: "We create unforgettable events that captivate audiences and amplify your brand's impact. From strategy to execution, we turn moments into lasting impressions. Let's make your event a success!",
      sub: "Event Marketing",
    },
  ],

  carouselTitle: "Our Work",
  brandTitle: "Our Brands",

  whyChooseUsTitle: "Why Choose Us?",
  stats: [
    { label: "Creators Association", number: 700000, suffix: "+" },
    { label: "Brands", number: 50, suffix: "+" },
    { number: 200, label: "Campaigns", suffix: "+" },
    { label: "Views Delivered", number: 1, suffix: "Bn+" },
    { number: 14, label: "Languages", suffix: "+" },
    { suffix: "+", number: 24, label: "States" },
    { suffix: "+", number: 10, label: "Services" },
    { suffix: "%", number: 25, label: "Cost Optimisation" },
  ],
  reasons: [
    {
      desc: "Every campaign is backed by analytics and insights to maximize ROI.",
      title: "Data-Driven Approach",
    },
    {
      desc: "Our team delivers innovative content that stands out in crowded markets.",
      title: "Creative Excellence",
    },
    {
      title: "Full-Service Agency",
      desc: "From strategy to execution, we handle everything under one roof.",
    },
  ],

  testimonialsTitle: "Words From Our Client",
  testimonialsSubtitle: "",
  testimonials: [
    {
      designation: "Chief Marketing Manager",
      company: "Reliance Retail Limited",
      name: "Sadhu Kamal",
      logoUrl: "https://www.relianceretail.com/img/logo.png",
      website: "www.relianceretail.com",
      review: "Working with Winit Media was a great experience. Their influencer marketing strategy helped increase our brand awareness, engagement, and reach. The team was professional, responsive, and delivered excellent results.",
      service: "Influencer Marketing",
      id: "a342ed96-f45e-49c8-944c-c99e34f61f4c",
    },
    {
      id: "27bac41b-fb4b-4d80-9c99-f0d58fb1643e",
      website: "www.lokmat.com",
      review: "Harshit and the entire team at Winit Media have been extremely supportive throughout the campaign. Their understanding of the brief, proactive approach, and timely delivery helped us bring the brand's vision to life seamlessly. It was a smooth and collaborative experience from start to finish.",
      service: "Influencer Marketing",
      name: "Simran Shergill",
      logoUrl: "https://india.mom-gmr.org/uploads/tx_lfrogmom/media/16502-1592_import.png",
      company: "Lokmat Media Pvt. Ltd.",
      designation: "Assistant Manager - Brand Solutions",
    },
    {
      name: "Tejas Jadhav",
      logoUrl: "https://www.brandconcepts.in/wp-content/uploads/2024/03/BCL-logo.jpg",
      company: "Brand Concepts Ltd",
      designation: "Marketing Manager",
      id: "89942ee2-0436-437c-989f-be355528f04d",
      service: "Influencer Marketing",
      review: "It was a really good experience working with the Winit team. The team is highly supportive and maintains excellent communication with its clients. Keep up the great work, and we look forward to continuing this successful partnership.",
      website: "https://www.brandconcepts.in/",
    },
    {
      designation: "Product Marketing & Performance Manager",
      name: "Anika Chirawawala",
      logoUrl: "https://www.augmont.com/assets/logos/augmont-logo.webp",
      company: "Augmount Goldtech Private Limited",
      website: "https://www.augmont.com/",
      service: "Influencer Marketing",
      review: "The content created by the selected influencer provided high reach and engagement for our recycling awareness campaign. Overall, the experience was great and efficient.",
      id: "6d570e03-37e7-404c-be73-6fced05406c9",
    },
    {
      id: "3c243f88-5a07-47ad-9cc5-c0920493f5ea",
      website: "https://everestfleet.com/",
      service: "Influencer Marketing",
      review: "Our experience working with Winit has been extremely positive. Influencer marketing has become an important part of our brand-building strategy, and Winit has consistently helped us execute impactful campaigns with the right creator partnerships. Through these initiatives, we have seen a noticeable increase in brand awareness and a significant expansion of our social media reach. Their team's understanding of our objectives, responsiveness, and execution capabilities have made them a valuable marketing partner.",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVXiVcbrdYqxNp38y0CVQ0ilDyvqMs36zHJfj2tzWxpg&s=10",
      company: "Everest Fleet Pvt Ltd",
      name: "Ekta Lunagariya",
      designation: "Head of Marketing & Communications",
    },
    {
      website: "http://lokmat.net/",
      review: "\"Working with Harshit & team has been an absolute pleasure. The quality of work, responsiveness, and commitment to delivering have been consistently impressive. He makes even the most demanding projects feel effortless through professionalism and collaborative approach. We truly value this partnership and look forward to creating many more successful campaigns together.\"",
      service: "Influencer Marketing & End-to-End Campaign Execution",
      id: "3ea2102c-ad2c-4cc5-8faa-1dde6e9cc112",
      designation: "General Manager - Brand Solutions & Influencer Marketing",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsud2pMJkeXgvCZuzcIbpBXWQQevgI1lpvp1WiHqZLNhNjmjQqKBIYn8x&s=10",
      company: "Lokmat Media Pvt Ltd",
      name: "Dilip Jain",
    },
    {
      id: "8bbb919b-b18c-4ed6-9522-b325b771113c",
      website: "blackberrys.com",
      review: "Great Experience and helped us uplift online business.",
      service: "Influencer Marketing & UGC Content Production",
      logoUrl: "https://blackberrys.com/cdn/shop/files/LOGOheaderenew_1.png?v=1723786138&width=270",
      name: "Gaurav Bedi",
      company: "BlackBerrys",
      designation: "Manager",
    },
    {
      id: "b799bda6-085a-4aa2-8943-f21381d99599",
      website: "http://www.minus1lifestyle.com",
      review: "The team is very prompt and the execution is on point.",
      service: "Influencer Marketing & UGC Content Production",
      company: "Minus One",
      name: "Harsh Vyas",
      logoUrl: "https://minus1lifestyle.com/cdn/shop/files/ChatGPT_Image_May_19_2026_12_31_10_PM.png?v=1779272652&width=200",
      designation: "D2C Head",
    },
  ],

  footerTitle: "Lets WIN-IT",
  footerTagline: "Shaping success stories through powerful brand narratives and strategic marketing solutions.",
  footerQuickLinksTitle: "Quick Links",
  footerQuickLinks: [
    { href: "#home", label: "Home" },
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#work" },
    { label: "Clients", href: "#clients" },
    { href: "/blogs", label: "Blogs" },
    { label: "Contact", href: "#contact" },
  ],
  footerContactTitle: "Contact Us",
  contactPhone: "+91 8076098248",
  contactAddress: "F- 226, Flat No. 4, Third Floor Block- F, New Delhi South Delhi, DELHI, 110030",
  contactEmail: "harshit@winitmedia.com",
  socialLinks: [
    {
      href: "https://www.facebook.com/p/Winit-Media-61573200579330/",
      label: "Facebook",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/winitmedia/",
    },
    {
      href: "https://x.com/winitmedia",
      label: "X",
    },
    {
      href: "https://in.linkedin.com/company/winit-media",
      label: "LinkedIn",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@WinitMedia",
    },
  ],
  footerCopyright: "© 2026 WinIt. All rights reserved.",

  brands: [
    {
      id: "a848da89-5e9d-44b0-ac8b-049dee975e7b",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1VMEwqDGe7FIcV89IKGXmSCAZ5NbxxcoIxyftLdsV9A&s=10",
      name: "",
      link: "",
    },
    {
      link: "",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1M_HnYLkV2nEC_ODoRBgJwrHH0S7SPx3H01rHf-tgEY4kGFaxcCG3zow&s=10",
      name: "",
      id: "c53a6901-8989-4f60-9ea4-70e67fd9f537",
    },
    {
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShpk_Voq0I5DJ6e45rWMTZthTkH712tLRKi1NaAVBrgQ&s=10",
      name: "",
      id: "68d86381-38c4-48c5-9215-3a88b42bc311",
      link: "",
    },
    {
      name: "",
      imageUrl: "https://promanagecdn.blob.core.windows.net/promanage/biz-live/img/11742550-11742550-8fc714a5.jpeg",
      id: "9c381de1-1c73-4aa7-88a0-b6ad0b4fe8d9",
      link: "",
    },
    {
      link: "",
      id: "1ebbd4c4-ba2c-4205-bdb6-871d37e9556d",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/54/JioMart_logo.svg",
      name: "",
    },
    {
      id: "afc172a1-07c2-4697-a91c-3c088af169f2",
      imageUrl: "https://www.companieshistory.com/wp-content/uploads/2021/02/Kotak-Mahindra-Bank-Ltd-logo.jpg",
      name: "",
      link: "",
    },
    {
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQroQbj1qvrNJhD03pNhBDYiTtsItBNtz_XIgFRiukI5fYFaElCWCXrGlH&s=10",
      name: "",
      id: "37eccc91-23d4-4153-904e-e4d894495caf",
      link: "",
    },
    {
      link: "",
      imageUrl: "https://minus1lifestyle.com/cdn/shop/files/LOGO_3_1000x1000.png?v=1747720082",
      name: "",
      id: "61f399f3-af63-40be-8a32-1101adc3d43a",
    },
    {
      name: "",
      imageUrl: "https://media.licdn.com/dms/image/v2/D4E0BAQGg6dgI_trUFg/company-logo_200_200/company-logo_200_200/0/1713252847397?e=2147483647&v=beta&t=BCJ8Q6tMeYDcLpzvxQ8Rp2cnqmXEon3P7p6S07h4BBo",
      id: "63fc19a8-3fbd-413c-a737-5c3cb6ec3e85",
      link: "",
    },
    {
      id: "49efca14-9cc3-4f21-a520-1a750795dd78",
      imageUrl: "https://cdn.prod.website-files.com/6239d45df8c8f750082d66ea/65006fbd35bb4e7ddc9b31fb_pmallen.png",
      name: "",
      link: "",
    },
    {
      id: "ac5777b3-47a4-4487-ac72-933b2df3b48d",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPN7IbEhborgoG4Sl3i4n0xnUmcHTJBWT_j8bKjlc1CxiG8kS2TmWS-nqt&s=10",
      name: "",
      link: "",
    },
    {
      link: "",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e6/Smart_Bazaar_logo.png",
      name: "",
      id: "57b0ac8c-88bc-405e-a778-cf7fc4e3e9eb",
    },
    {
      link: "",
      id: "906844ac-10da-4a59-8d0d-a5f706541a05",
      name: "",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbYNCdYTzgFLqwQxP1SGsedaA2G-CPC9gFD0K-MJ1YynC13vBYq_vkoqF&s=10",
    },
    {
      link: "",
      name: "",
      imageUrl: "https://dtbtob4osa700.cloudfront.net/BrandsImages/14112022150039336_brlo.jpg",
      id: "03aa7124-009e-4b53-bffa-21f88c6808bf",
    },
    {
      id: "f6ad43ad-8615-49a9-acc4-3ad95463a45a",
      imageUrl: "https://cdn.merchant-console.yougotagift.com/media/brands/image/da76068a-782b-4593-9bce-f9dc5c6f1753.png",
      name: "",
      link: "",
    },
    {
      link: "",
      id: "e2362042-059b-49f5-8345-f85afac6a3f2",
      name: "",
      imageUrl: "https://1000logos.net/wp-content/uploads/2020/09/Superdry-Logo-2014.png",
    },
    {
      imageUrl: "https://erp.jainam.in/files/footer_logo.png",
      name: "",
      id: "021a199a-ee82-4e3f-81e4-de6a9f80a755",
      link: "",
    },
  ],
  defaultVideoUrl: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1783758406/winit/videos/mgyb3zr3ln96wxvpod5h.mp4",
  carouselVideos: [
    {
      name: "Jainam Broking Limited",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782332863/winit/videos/rbncqmw6z77mzfivm4jo.mp4",
      id: "3c2f933a-2ae4-4418-9cee-367e5de895bd",
    },
    {
      name: "Superdry",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285606/winit/videos/e01qd18bulpou2toafbu.mp4",
      id: "61a9dfdc-ac53-4b6b-b7f5-87f45a15c521",
    },
    {
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285630/winit/videos/juxcedbupcjrimryvred.mp4",
      id: "fb948d03-c31d-4d83-9013-69ff7e4fc6ba",
      name: "Trends",
    },
    {
      name: "Spykar",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285568/winit/videos/cfyb2mvye9erjmsj8rsn.mp4",
      id: "b54a65bd-2985-4b6e-b8fa-fa4af927926a",
    },
    {
      name: "Snitch",
      id: "af7f687b-cf05-4157-9cf1-15dd568bfb4f",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285553/winit/videos/rpwmrmteysvl8syz4qiy.mp4",
    },
    {
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285530/winit/videos/dj5024fqqgpautbiskva.mp4",
      id: "2f73aaca-5784-4238-8b47-4ebdfcdcaadc",
      name: "Smart Bazar",
    },
    {
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285430/winit/videos/teuwdnzaf9q0vf1uegpp.mp4",
      id: "4f746313-7b80-429f-95ae-c0be8efb0c85",
      name: "Royal Challenge",
    },
    {
      name: "Reliance Digital",
      id: "4834cb09-c436-40d6-9999-5bb19149dc0c",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285406/winit/videos/yk5lafa78cngkdeuwyci.mp4",
    },
    {
      name: "Peakmin Allen",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285384/winit/videos/wazahpmht3b28dvxah4u.mp4",
      id: "4f68a4dd-45bf-4155-8a7e-c18e3c528eea",
    },
    {
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285375/winit/videos/mrunafb8ngpda7pfpltj.mp4",
      id: "50290432-16f0-4219-a747-4d62e50346a0",
      name: "Navniv Menswear",
    },
    {
      name: "Navniv Menswear",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285370/winit/videos/bqv880isp0s3skjc0u4q.mp4",
      id: "ef9e9a72-c8fe-4e31-ada0-cddc35eff9d2",
    },
    {
      name: "Minus One Lifestyle",
      id: "b0593734-9864-4ca3-93ed-8e14e8f82b26",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285366/winit/videos/gc3zlf2cqz57ksbvju8k.mp4",
    },
    {
      name: "Minus One Lifestyle",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285362/winit/videos/ysix8oqwh2yxyxmeq1dq.mp4",
      id: "4fe8bc7e-2b7f-4066-81a6-773ec6d48169",
    },
    {
      name: "Rocketry Vision",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1783622341/winit/videos/fs2r7fcur4imfbekrmwq.mp4",
      id: "9dd43efd-9f9c-4d7e-b3f4-3d6ec3b13299",
    },
    {
      name: "Lollapalooza",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285354/winit/videos/zttt8pahteov9qdgdwp2.mp4",
      id: "044bb8c4-eee2-42ca-a415-434deeeff8a9",
    },
    {
      name: "Kotak Bank",
      id: "20c2c428-8148-4db5-8edd-eb19a0462201",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285333/winit/videos/hxf5nyudbyavrey8y4yn.mp4",
    },
    {
      name: "JioMart",
      id: "676b464f-e0c3-4790-a7a0-d88fffde694b",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285329/winit/videos/pmqbh5ftxyo3uamdm6tu.mp4",
    },
    {
      name: "JioMart",
      id: "240a05c4-0e39-4a0c-b291-e99d1e4657c6",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285318/winit/videos/tvxmweox47s2kobn8rew.mp4",
    },
    {
      name: "JioMart",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285301/winit/videos/gqtivcy51oktd83nbq6p.mp4",
      id: "7c2606ce-bbc4-4b57-a39e-b3bdc8b3c561",
    },
    {
      id: "43efed59-c26a-4d4d-a63a-9df8e627805a",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285286/winit/videos/l2tbgr0ga8gpot5r7hnv.mp4",
      name: "gofresh",
    },
    {
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285265/winit/videos/nfgca8dncu3lczpyy4y7.mp4",
      id: "36e02128-4452-4e98-bf67-6e1701ea38f8",
      name: "Blackberrys Men",
    },
    {
      name: "Bagline",
      id: "fd1701a6-2f42-4e98-84cc-94832226725d",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285251/winit/videos/zk79ilknsxa523zwm6yl.mp4",
    },
    {
      name: "Angel One",
      url: "https://res.cloudinary.com/dpoe8jyov/video/upload/v1782285237/winit/videos/ugl8ci9hjopehx8tqlze.mp4",
      id: "b48c49dd-a455-4931-8245-3a5385a233dc",
    },
  ],

  blogUsers: [
    { email: "harshit@winitmedia.com", displayName: "Harshit" },
  ],

  pageTitle: "WinIt - Shaping Success Stories",
  pageDescription: "We transform brand stories into powerful narratives that drive success.",
};

/** Merge raw Firestore data with defaults, falling back for empty arrays. */
export function mergeSiteContent(raw: Partial<SiteContent>): SiteContent {
  return {
    ...defaultSiteContent,
    ...raw,
    testimonials:
      raw.testimonials && raw.testimonials.length > 0
        ? raw.testimonials
        : defaultSiteContent.testimonials,
    stats:
      raw.stats && raw.stats.length > 0
        ? raw.stats
        : defaultSiteContent.stats,
    brands:
      raw.brands && raw.brands.length > 0
        ? raw.brands
        : defaultSiteContent.brands,
    services:
      raw.services && raw.services.length > 0
        ? raw.services
        : defaultSiteContent.services,
    carouselVideos:
      raw.carouselVideos && raw.carouselVideos.length > 0
        ? raw.carouselVideos
        : defaultSiteContent.carouselVideos,
    footerQuickLinks:
      raw.footerQuickLinks && raw.footerQuickLinks.length > 0
        ? raw.footerQuickLinks
        : defaultSiteContent.footerQuickLinks,
    navLinks:
      raw.navLinks && raw.navLinks.length > 0
        ? raw.navLinks
        : defaultSiteContent.navLinks,
  } as SiteContent;
}
