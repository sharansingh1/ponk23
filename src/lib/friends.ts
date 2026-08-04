export type FriendType = "presentation" | "video" | "text";

export type Friend = {
  id: string;
  name: string;
  /** One short line under their name — an inside joke, a role, a memory. */
  intro?: string;
  /** presentation = slideshow link, video = video link, text = plain written message. */
  type: FriendType;
  /** Link to their presentation or video (Slides/Canva/Drive/YouTube/etc) — opens in a new tab. Required for "presentation" and "video". */
  url?: string;
  /** Optional second presentation link, for friends who submitted two. */
  url2?: string;
  /** The written message to display — required for "text" (when only one author). */
  message?: string;
  /** For a shared "text" slot with more than one author — each renders as its own separated note in the same box. */
  messages?: { author: string; text: string }[];
  /** Thumbnail image for presentation/video cards (a direct image URL or a path under /public). */
  thumbnail?: string;
};

/**
 * Real friend list. Slots with two names shared a submission and appear together.
 * Fill in the real `url` (for presentation/video) or `message` (for text) before launch.
 */
export const friends: Friend[] = [
  { id: "kamal", name: "Kamal", type: "presentation", url: "https://docs.google.com/presentation/d/1KJxlWQpiv967VBos_fYYhZEqDD0EhYCKSxOC8wUYOPY/edit?usp=sharing", thumbnail: "https://drive.google.com/thumbnail?id=1KJxlWQpiv967VBos_fYYhZEqDD0EhYCKSxOC8wUYOPY&sz=w1200" },
  { id: "sophie-jared", name: "Sophie & Jared", type: "presentation", url: "https://canva.link/f61bdh0svu6iywr", thumbnail: "/thumbnails/sophie-jared.png" },
  { id: "anu-prabhjot", name: "Anu & Prabhjot", type: "presentation", url: "https://docs.google.com/presentation/d/1bJYShu3Js99SIvEKruW_YDQtHGF66uk0zPvmhspJtJc/edit?usp=sharing", thumbnail: "https://drive.google.com/thumbnail?id=1bJYShu3Js99SIvEKruW_YDQtHGF66uk0zPvmhspJtJc&sz=w1200" },
  { id: "pierre", name: "Pierre", type: "presentation", url: "https://canva.link/09p2w2nme23kc0f", thumbnail: "/thumbnails/pierre.png" },
  { id: "arpit-arnav", name: "Arpit & Arnav", type: "presentation", url: "https://docs.google.com/presentation/d/1lCsX9lysj2wEQ9QhupTVm1sGRj7abGgjxZbeOq0XZlE/edit?usp=drivesdk", thumbnail: "https://drive.google.com/thumbnail?id=1lCsX9lysj2wEQ9QhupTVm1sGRj7abGgjxZbeOq0XZlE&sz=w1200" },
  {
    id: "sirat-aarav",
    name: "Sirat & Aarav",
    type: "text",
    messages: [
      {
        author: "Sirat",
        text: "Happy birthday Didi! I hope u have an amazing birthday! You are always so nice to, and I’m very grateful for that and I’m so happy you are my cousin. Your basically my sister, and I love you soooo much\n\nLove, Sirat",
      },
      {
        author: "Aarav",
        text: "Happy birthday didi, you are truly a wonderful soul and it is a blessing to have you as a part of our family! You have stayed strong for us through our hard times and supported us all. Once again, happy birthday! Much love ❤️🎂",
      },
    ],
  },
  { id: "sharan", name: "Sharan", type: "presentation", url: "https://canva.link/s07rjyjsk0pfrsm", thumbnail: "/thumbnails/sharan.png" },
  { id: "rohan", name: "Rohan", type: "video", url: "https://drive.google.com/file/d/1SCPQ7WDhlK_zLgQXXlDqcGfX0PHwMcNd/view", thumbnail: "https://drive.google.com/thumbnail?id=1SCPQ7WDhlK_zLgQXXlDqcGfX0PHwMcNd&sz=w1200" },
  { id: "pratika", name: "Pratika", type: "presentation", url: "https://docs.google.com/presentation/d/16xeZpAMK1lDIAA3etSgXFnIrZK5gJwXAwNLcXWzIUek/edit?usp=sharing", url2: "https://docs.google.com/presentation/d/1hJ-Ac_t2rakn1ISboCG765EIVNeHX7pDvWcanSUWfvE/edit?usp=sharing", thumbnail: "https://drive.google.com/thumbnail?id=16xeZpAMK1lDIAA3etSgXFnIrZK5gJwXAwNLcXWzIUek&sz=w1200" },
  {
    id: "surya",
    name: "Surya",
    type: "text",
    message:
      "Dear Priyanka, Happy birthday! Today is all about celebrating you and everything that makes you wonderful. You have such a bright, generous spirit, and the way you throw yourself into the things you love is genuinely inspiring. Whether it's your passions, your goals, or the little things that light you up, you always bring so much energy and heart to everything you do. The world is a better place with you chasing after what matters to you. I hope this year brings you closer to all the things you're working toward and dreaming about. You've got so much talent and drive, and you deserve to see it all pay off. Here's to a year filled with joy, success, and every good thing coming your way.\n\nWith love and best wishes, Surya and Auntie Ji",
  },
  { id: "kaiden", name: "Kaiden", type: "presentation", url: "https://docs.google.com/presentation/d/1HFauNmD87En5mkfm_CpK3MrgJaCijMBinex1mvgbFdA/edit?usp=drivesdk", thumbnail: "https://drive.google.com/thumbnail?id=1HFauNmD87En5mkfm_CpK3MrgJaCijMBinex1mvgbFdA&sz=w1200" },
  { id: "manjot-harjot", name: "Manjot & Harjot", type: "presentation", url: "https://docs.google.com/presentation/d/1nz9lr7Yjo28JYlyRUYGVDsHSuyitgTdNrcQZtyEqsr4/edit?usp=sharing", thumbnail: "https://drive.google.com/thumbnail?id=1nz9lr7Yjo28JYlyRUYGVDsHSuyitgTdNrcQZtyEqsr4&sz=w1200" },
  {
    id: "hursh",
    name: "Hursh",
    type: "text",
    message:
      "So if Priyanka was a bhangra segment, what move would she be? Well, what options are we looking at? We got hard jhummar, soft jhummar, ending, props, dhamaal, jugni/chaal, and intro. Off rip, I don't think props represent her because they are limited in move creativity, and we all know Priyanka has really creative party themes and ideas. Ending also can go away since she keeps the party going till everyone else taps out. Dhamaal and jugni/chaal are too simple for her, she adds her own spice to a conversation that makes it interesting and more importantly ✨goofy✨. Intro also doesn't bode well simply because when you do meet her, it's very hard to forget her (she's very personable as you can all tell). So that leaves the jhummars….. Does priyanka have a soft spot for people? Yes. Does she give people a hard time for the plot and hold them accountable? Also yes. So which jhummar could she really be? Both? That's a cop out. Let's agree that she could be either but from my experiences with her and her tomfoolery, she's definitely a more hard jhummar person. Why not soft jhummar? Because she doesn't show her personality in a soft way. She tells it how it is and doesn't sugarcoat things. Plus she reminds me of how old I am, which is brutal.\n\nHappy Birthday Priyanka and I hope you enjoy your Jordan year 🥳🫶",
  },
  { id: "matt", name: "Matt", type: "video", url: "https://drive.google.com/file/d/1Gtzpj8P0XJmDianneL8blQKrNpFOpl83/view", thumbnail: "https://drive.google.com/thumbnail?id=1Gtzpj8P0XJmDianneL8blQKrNpFOpl83&sz=w1200" },
];
