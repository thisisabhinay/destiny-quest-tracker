import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { BookOpen, Crown, Skull, Star, Target, Shield, Zap, Users, User, AlertCircle, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

// Destiny rarity / theme colors mapping
const CATEGORY_META = {
  campaign: { icon: BookOpen, color: "#10b981", bg: "bg-emerald-500/20" }, // Uncommon
  raid: { icon: Crown, color: "#f59e0b", bg: "bg-amber-500/20" },       // Exotic (or Raid orange)
  dungeon: { icon: Skull, color: "#a855f7", bg: "bg-purple-500/20" },    // Legendary
  exoticMission: { icon: Star, color: "#facc15", bg: "bg-yellow-400/20" }, // Exotic
  exoticWeapon: { icon: Target, color: "#ceae33", bg: "bg-[#ceae33]/20" },  // Exotic Gold
  exoticArmor: { icon: Shield, color: "#ceae33", bg: "bg-[#ceae33]/20" },   // Exotic Gold
  strike: { icon: Zap, color: "#3b82f6", bg: "bg-blue-500/20" },          // Rare
  seal: { icon: Award, color: "#8b5cf6", bg: "bg-violet-500/20" }       // Violet for Titles
};

export const ContentCard = ({ item }) => {
  const { completedItems, toggleCompletion } = useAppContext();
  
  const itemId = item.id || item.name;
  const isCompleted = completedItems.has(itemId);
  
  const isVaulted = item.vaulted === true || item.status === 'vaulted';
  
  const meta = CATEGORY_META[item.itemCategory] || CATEGORY_META.exoticWeapon;
  const Icon = meta.icon;

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    toggleCompletion(itemId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className={cn(
            "group relative overflow-hidden transition-all duration-150 cursor-pointer flex flex-col text-left",
            "border border-white/5 bg-[#1c1c1e]/90 backdrop-blur-sm rounded-sm shadow-sm",
            isCompleted ? "opacity-50 grayscale hover:opacity-80" : "hover:border-white/20 hover:bg-[#252528] hover:shadow-md",
            isVaulted && !isCompleted ? "opacity-75" : ""
          )}
        >
          {/* Accent Line matching Destiny Rarity Colors */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 shadow-[1px_0_4px_rgba(0,0,0,0.5)]" 
            style={{ backgroundColor: meta.color }} 
          />
          
          <div className="p-3 pl-4 flex gap-3 h-full items-start">
            <div className="pt-0.5 relative z-10 flex-shrink-0" onClick={handleCheckboxClick}>
              <Checkbox 
                checked={isCompleted}
                onCheckedChange={() => toggleCompletion(itemId)}
                className={cn(
                  "h-5 w-5 transition-colors rounded-none border-white/30",
                  isCompleted ? "bg-[#35e082] border-[#35e082]" : "hover:border-white/70"
                )}
                style={isCompleted ? { backgroundColor: meta.color, borderColor: meta.color } : {}}
              />
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className={cn(
                  "font-semibold text-[13px] leading-tight break-words tracking-wide",
                  isCompleted ? "line-through text-white/50" : "text-white/90"
                )}>
                  {item.name}
                </h4>
                <div className="p-1 rounded flex-shrink-0" style={{ backgroundColor: `${meta.color}20` }}>
                  <Icon size={12} color={meta.color} />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {isVaulted && (
                   <Badge className="rounded-[2px] px-1 py-0 h-[14px] text-[8px] bg-red-900/40 text-red-300 hover:bg-red-900/40 uppercase tracking-widest border-red-900">Vaulted</Badge>
                )}
                {item.kioskAvailable && (
                  <Badge className="rounded-[2px] px-1 py-0 h-[14px] text-[8px] bg-orange-900/40 text-orange-400 hover:bg-orange-900/40 uppercase tracking-widest border-orange-900">Kiosk</Badge>
               )}
                {item.priority === 3 && (
                  <Badge className="rounded-[2px] px-1 py-0 h-[14px] text-[8px] bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 uppercase tracking-widest border-yellow-700">Meta</Badge>
                )}
                {item.damageType && (
                  <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">
                    {item.damageType}
                  </span>
                )}
              </div>
              
              {item.description && (
                 <p className="text-[11px] leading-snug text-white/50 line-clamp-2 mt-1 font-light italic">
                   "{item.description}"
                 </p>
              )}

              {(item.fireteamSize || item.solo) && (
                <div className="flex items-center gap-3 pt-2 text-[9px] uppercase tracking-widest text-white/40 font-bold">
                  {item.fireteamSize && (
                    <span className="flex items-center gap-1"><Users size={10} /> {item.fireteamSize}</span>
                  )}
                  {item.solo && (
                    <span className="flex items-center gap-1 text-[#10b981]"><User size={10} /> Solo</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#111111] border border-white/10 text-white rounded-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg font-bold tracking-wider">
            <div className="p-1.5 rounded" style={{ backgroundColor: `${meta.color}20` }}>
              <Icon size={18} color={meta.color} />
            </div>
            {item.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4 text-sm text-white/80">
          <p className="italic text-white/60 text-xs">"{item.description}"</p>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-white/5 p-4 rounded-sm border border-white/5">
            {item.source && (
              <div className="col-span-2">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Source</span>
                <span className="text-white font-medium text-xs">{item.source}</span>
              </div>
            )}
            
            {item.reward && (
              <div className="col-span-2">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Reward</span>
                <span className="text-[#35e082] font-semibold text-xs">{item.reward}</span>
              </div>
            )}

            {item.exoticDrop && (
              <div className="col-span-2 md:col-span-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Exotic Drop</span>
                <span className="text-[#ceae33] font-semibold text-xs">{item.exoticDrop}</span>
              </div>
            )}
            
            {item.kioskCost && (
              <div className="col-span-2 md:col-span-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Kiosk Cost</span>
                <span className="text-orange-400 font-medium text-xs">{item.kioskCost}</span>
              </div>
            )}
            
            {item.encounters && item.encounters.length > 0 && (
              <div className="col-span-2 pt-2 border-t border-white/5 mt-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Encounters</span>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {item.encounters.map((enc, i) => (
                    <span key={i} className="bg-white/10 px-2 py-1 rounded-sm text-white/80">{enc}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {item.note && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm flex gap-3 items-start">
              <AlertCircle size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-100/80 text-xs leading-relaxed">{item.note}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            {item.hasCatalyst && <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] rounded-sm uppercase tracking-widest py-0.5">Catalyst Available</Badge>}
            {item.craftable && <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px] rounded-sm uppercase tracking-widest py-0.5">Craftable</Badge>}
            {item.soloFlawless && <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] rounded-sm uppercase tracking-widest py-0.5">Solo Flawless</Badge>}
            {item.seal && <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] rounded-sm uppercase tracking-widest py-0.5">{item.seal} Seal</Badge>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
