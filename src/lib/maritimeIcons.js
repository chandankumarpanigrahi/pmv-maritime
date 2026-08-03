import React from "react";
import { MdOutlineAnchor } from "react-icons/md";
import {
  LuShip,
  LuShieldCheck,
  LuCompass,
  LuHandshake,
  LuWrench,
  LuUsers,
  LuGraduationCap,
  LuGlobe,
  LuBox,
  LuTrendingUp,
  LuFileText,
  LuTruck,
  LuCpu,
  LuRadio,
  LuFuel,
  LuLeaf,
  LuScale,
  LuBriefcase,
  LuLifeBuoy,
  LuHardHat,
  LuSearch,
  LuCoins,
  LuLayers,
  LuMapPin,
  LuClock,
  LuZap,
  LuAward,
  LuClipboardCheck,
} from "react-icons/lu";
import {
  TbShip,
  TbSailboat,
  TbAnchor,
  TbSubmarine,
  TbPropeller,
  TbCrane,
  TbContainer,
  TbBuildingWarehouse,
  TbCertificate,
  TbShieldLock,
  TbWaveSine,
  TbCompass,
  TbWorld,
  TbFileCheck,
} from "react-icons/tb";
import {
  GiShipWheel,
  GiLighthouse,
  GiCargoShip,
  GiSubmarine,
  GiAnchor,
  GiCargoCrate,
  GiFishingBoat,
} from "react-icons/gi";
import {
  FaShip,
  FaAnchor,
  FaWater,
  FaLifeRing,
  FaHelmetSafety,
  FaSatelliteDish,
  FaOilWell,
  FaGaugeHigh,
  FaRoute,
  FaGears,
  FaTowerObservation,
  FaScrewdriverWrench,
  FaBuildingColumns,
} from "react-icons/fa6";

// ─── 45 Verified Maritime & Marine Preset Icons Palette ────────
export const PRESET_ICONS = [
  // Nautical & Vessels
  { id: "MdOutlineAnchor", name: "Anchor", Icon: MdOutlineAnchor },
  { id: "GiShipWheel", name: "Ship Captain Wheel", Icon: GiShipWheel },
  { id: "LuShip", name: "Ship / Vessel", Icon: LuShip },
  { id: "FaShip", name: "Ocean Liner Ship", Icon: FaShip },
  { id: "GiCargoShip", name: "Cargo Merchant Ship", Icon: GiCargoShip },
  { id: "TbShip", name: "Freight Cargo Vessel", Icon: TbShip },
  { id: "TbSailboat", name: "Marine Boat", Icon: TbSailboat },
  { id: "GiFishingBoat", name: "Trawler Boat", Icon: GiFishingBoat },
  { id: "GiSubmarine", name: "Subsea Submarine", Icon: GiSubmarine },
  { id: "TbSubmarine", name: "Subsea Offshore Tech", Icon: TbSubmarine },
  { id: "GiLighthouse", name: "Lighthouse Beacon", Icon: GiLighthouse },
  { id: "FaAnchor", name: "Heavy Nautical Anchor", Icon: FaAnchor },
  { id: "GiAnchor", name: "Mooring Anchor", Icon: GiAnchor },
  { id: "TbAnchor", name: "Port Anchor", Icon: TbAnchor },
  { id: "FaWater", name: "Ocean Waves", Icon: FaWater },

  // Engineering, Propulsion & Machinery
  { id: "TbPropeller", name: "Ship Propulsion Engine", Icon: TbPropeller },
  { id: "FaGears", name: "Engine Machinery Gears", Icon: FaGears },
  { id: "FaScrewdriverWrench", name: "Marine Repair Wrench", Icon: FaScrewdriverWrench },
  { id: "FaGaugeHigh", name: "Engine Telemetry Gauge", Icon: FaGaugeHigh },
  { id: "FaSatelliteDish", name: "Offshore SatCom Dish", Icon: FaSatelliteDish },
  { id: "FaOilWell", name: "Offshore Oil Rig", Icon: FaOilWell },

  // Port Operations, Cargo & Logistics
  { id: "TbCrane", name: "Port Crane Loader", Icon: TbCrane },
  { id: "TbContainer", name: "Shipping Container", Icon: TbContainer },
  { id: "GiCargoCrate", name: "Port Cargo Crate", Icon: GiCargoCrate },
  { id: "TbBuildingWarehouse", name: "Terminal Logistics Warehouse", Icon: TbBuildingWarehouse },
  { id: "FaTowerObservation", name: "Port Control Tower", Icon: FaTowerObservation },
  { id: "LuBox", name: "Port Logistics Box", Icon: LuBox },
  { id: "LuTruck", name: "Supply Chain Freight", Icon: LuTruck },

  // Navigation & Safety
  { id: "LuCompass", name: "Navigation Advisory", Icon: LuCompass },
  { id: "TbCompass", name: "Gyro Compass", Icon: TbCompass },
  { id: "FaRoute", name: "Vessel Passage Route", Icon: FaRoute },
  { id: "FaLifeRing", name: "SOLAS Life Ring", Icon: FaLifeRing },
  { id: "LuLifeBuoy", name: "Emergency Life Buoy", Icon: LuLifeBuoy },
  { id: "FaHelmetSafety", name: "Shipbuilding Safety Helmet", Icon: FaHelmetSafety },
  { id: "LuShieldCheck", name: "Safety & Compliance", Icon: LuShieldCheck },
  { id: "TbShieldLock", name: "ISPS Security Code", Icon: TbShieldLock },
  { id: "TbCertificate", name: "STCW Class Certificate", Icon: TbCertificate },

  // Management & Advisory
  { id: "LuHandshake", name: "Consultancy Partnership", Icon: LuHandshake },
  { id: "LuUsers", name: "Crew Management", Icon: LuUsers },
  { id: "LuGraduationCap", name: "Maritime Education", Icon: LuGraduationCap },
  { id: "LuGlobe", name: "Global Operations", Icon: LuGlobe },
  { id: "TbWorld", name: "Global Shipping Routes", Icon: TbWorld },
  { id: "LuTrendingUp", name: "Strategic Advisory", Icon: LuTrendingUp },
  { id: "LuFileText", name: "Technical Audits", Icon: LuFileText },
  { id: "TbFileCheck", name: "Vessel Survey Audit", Icon: TbFileCheck },
  { id: "FaBuildingColumns", name: "Maritime Law & Institution", Icon: FaBuildingColumns },
  { id: "LuScale", name: "Legal Regulatory Compliance", Icon: LuScale },
  { id: "LuCpu", name: "Digital Maritime Solutions", Icon: LuCpu },
  { id: "LuRadio", name: "Vessel Telemetry SatCom", Icon: LuRadio },
  { id: "LuFuel", name: "Bunkering Energy", Icon: LuFuel },
  { id: "LuLeaf", name: "Environmental Protection", Icon: LuLeaf },
  { id: "LuBriefcase", name: "Project Management", Icon: LuBriefcase },
  { id: "LuHardHat", name: "Shipyard Supervision", Icon: LuHardHat },
  { id: "LuSearch", name: "Vessel Inspection", Icon: LuSearch },
  { id: "LuCoins", name: "Financial Valuation", Icon: LuCoins },
  { id: "LuLayers", name: "Fleet Management", Icon: LuLayers },
  { id: "LuMapPin", name: "Terminal Location", Icon: LuMapPin },
  { id: "LuClock", name: "24/7 Operations", Icon: LuClock },
  { id: "LuZap", name: "Automation Electrical", Icon: LuZap },
  { id: "LuAward", name: "Quality Certification", Icon: LuAward },
  { id: "LuClipboardCheck", name: "Technical Inspection", Icon: LuClipboardCheck },
];

// Helper to render icon by string ID
export const renderIconById = (iconId, className = "h-5 w-5") => {
  const match = PRESET_ICONS.find((item) => item.id === iconId);
  if (match) {
    const IconComp = match.Icon;
    return <IconComp className={className} />;
  }
  return <MdOutlineAnchor className={className} />;
};
