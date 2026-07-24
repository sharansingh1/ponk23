import Hero from "@/components/Hero";
import Journey from "@/components/Journey/Journey";
import JourneyProvider from "@/components/Journey/JourneyProvider";
import DndGate from "@/components/gate/DndGate";
import FriendSlot from "@/components/Journey/FriendSlot";
import InterestPass from "@/components/Journey/InterestPass";
import Finale from "@/components/Journey/Finale";
import { friends } from "@/lib/friends";
import { buildStops } from "@/lib/journey";

export default function Home() {
  const stops = buildStops(friends);
  // The finale is a full-bleed section (like the hero), so it renders OUTSIDE
  // the Journey's centered max-width column — the road/background only span
  // the friend + interest stops.
  const columnStops = stops.filter((stop) => stop.kind !== "finale");

  return (
    <JourneyProvider>
      <DndGate />
      <main className="flex flex-col">
        <Hero />
        <Journey stopCount={columnStops.length}>
          {columnStops.map((stop, i) => {
            if (stop.kind === "friend") {
              return <FriendSlot key={stop.data.id} friend={stop.data} index={stop.index} total={friends.length} />;
            }
            return <InterestPass key={stop.id} id={stop.id} index={i} />;
          })}
        </Journey>
        <Finale />
      </main>
    </JourneyProvider>
  );
}
