import { Button } from "@slates/ui/Button";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoMdInfinite } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";



const features = [
    {
        icon: <IoMdInfinite />,
        title: "Infinite Canvas",
        background: "bg-blue-500/50",
        description: "Never feel restricted by space again. With an infinite canvas, you can zoom and pan freely, allowing your ideas to flow without boundaries. Whether you're sketching, brainstorming, or mapping out complex ideas, the limitless workspace adapts to your needs, giving you complete creative freedom."
    },
    {
      icon: <MdPeopleAlt />,
      title: "Real-time Collaboration",
      background: "bg-pink-500/50",
      description:
        "Work together seamlessly, no matter where your team is. Invite teammates to your board and see their changes happen instantly. Whether you’re brainstorming, designing, or teaching, real-time collaboration ensures everyone stays on the same page, enhancing productivity and teamwork.",
    },
    {
      icon: <FaCloudDownloadAlt />,
      title: "Cloud Sync",
      background: "bg-green-500/50",
      description:
        "Access your drawings from anywhere, at any time. Your work is securely stored in the cloud, so you never have to worry about losing progress. Whether you're switching devices or revisiting past projects, everything is just a click away, ready when you need it.",
    },
  ];

export default function Features() {
  return (
    <div className="w-full flex flex-col items-center justify-center my-10">
      <h2 className="font-semibold text-7xl">
        Features...
      </h2>
      <div className="w-full p-5 px-20 flex flex-col gap-4">
        {features.map((feature, index) => (
        <div
          key={index}
          className="px-8 py-5 flex flex-row gap-5 justify-between text-lg rounded-md border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]"
        >
          <div className={`flex ${feature.background} border-2 p-24 rounded-md my-2 w-1/2 items-center gap-3`}>
            <Button className="text-5xl" variant="tertiary">
              {feature.icon}
            </Button>
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
          </div>
          <p className="p-2 w-1/2">{feature.description}</p>
        </div>
      ))}
      </div>
    </div>
  );
}