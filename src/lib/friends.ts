export type Friend = {
  id: string;
  name: string;
  /** One short line under their name — an inside joke, a role, a memory. */
  intro?: string;
  /** Link to their presentation (Slides/Canva/Drive/etc) — opens in a new tab. */
  presentationUrl: string;
  /** Thumbnail image of the presentation (a direct image URL or a path under /public). */
  thumbnail: string;
};

/**
 * PLACEHOLDER DATA — replace every entry with the real friend list before launch.
 * Order here is the order they appear in the scroll journey.
 */
export const friends: Friend[] = [
  { id: "friend-1", name: "Friend One", intro: "swap in her name + presentation link + thumbnail here", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-1/1200/750" },
  { id: "friend-2", name: "Friend Two", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-2/1200/750" },
  { id: "friend-3", name: "Friend Three", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-3/1200/750" },
  { id: "friend-4", name: "Friend Four", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-4/1200/750" },
  { id: "friend-5", name: "Friend Five", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-5/1200/750" },
  { id: "friend-6", name: "Friend Six", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-6/1200/750" },
  { id: "friend-7", name: "Friend Seven", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-7/1200/750" },
  { id: "friend-8", name: "Friend Eight", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-8/1200/750" },
  { id: "friend-9", name: "Friend Nine", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-9/1200/750" },
  { id: "friend-10", name: "Friend Ten", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-10/1200/750" },
  { id: "friend-11", name: "Friend Eleven", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-11/1200/750" },
  { id: "friend-12", name: "Friend Twelve", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-12/1200/750" },
  { id: "friend-13", name: "Friend Thirteen", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-13/1200/750" },
  { id: "friend-14", name: "Friend Fourteen", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-14/1200/750" },
  { id: "friend-15", name: "Friend Fifteen", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-15/1200/750" },
  { id: "friend-16", name: "Friend Sixteen", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-16/1200/750" },
  { id: "friend-17", name: "Friend Seventeen", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-17/1200/750" },
  { id: "friend-18", name: "Friend Eighteen", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-18/1200/750" },
  { id: "friend-19", name: "Friend Nineteen", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-19/1200/750" },
  { id: "friend-20", name: "Friend Twenty", intro: "add a short intro line", presentationUrl: "#", thumbnail: "https://picsum.photos/seed/friend-20/1200/750" },
];
