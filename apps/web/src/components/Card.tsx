import React from "react";

const Card: React.FC<{
  usedFor: string;
  ValueOFTheCard: string | number;
  icon: React.ReactNode;
}> = ({ usedFor, ValueOFTheCard, icon }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4  overflow-hidden relative">
      <div className="absolute inset-0 shimmer opacity-20"></div>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <div className="text-sm font-medium text-foreground/80">{usedFor}</div>
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-bold text-foreground mb-1">
          {" "}
          {ValueOFTheCard}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="text-success font-medium">↗</span>
        </p>
      </div>
      {ValueOFTheCard}
    </div>
  );
};
export default Card;
