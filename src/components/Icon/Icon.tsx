import type { SvgIconProps } from "@mui/material/SvgIcon";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import RemoveRounded from "@mui/icons-material/RemoveRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import HubOutlined from "@mui/icons-material/HubOutlined";
import ScheduleRounded from "@mui/icons-material/ScheduleRounded";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import MenuRounded from "@mui/icons-material/MenuRounded";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import CheckRounded from "@mui/icons-material/CheckRounded";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import RestoreRounded from "@mui/icons-material/RestoreRounded";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import PushPinOutlined from "@mui/icons-material/PushPinOutlined";
import PublicRounded from "@mui/icons-material/PublicRounded";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import TabRounded from "@mui/icons-material/TabRounded";
import GridViewRounded from "@mui/icons-material/GridViewRounded";
import BedtimeOutlined from "@mui/icons-material/BedtimeOutlined";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import CropSquareRounded from "@mui/icons-material/CropSquareRounded";

function LogoIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
        <circle cx="11" cy="11" r="6.5" />
        <circle cx="11" cy="11" r="2" fill="currentColor" stroke="none" />
        <path d="M16 16l4.5 4.5" />
        <path d="M11 4.5V2.5M4.5 11H2.5M17.5 11h2" opacity=".6" />
      </g>
    </SvgIcon>
  );
}

const ICONS = {
  back: ArrowBackRounded, fwd: ArrowForwardRounded, reload: RefreshRounded, lock: LockOutlined, unlock: LockOpenOutlined,
  star: StarBorderRounded, starFilled: StarRounded, plus: AddRounded, minus: RemoveRounded, x: CloseRounded,
  search: SearchRounded, graph: HubOutlined, clock: ScheduleRounded, shield: ShieldOutlined, gear: SettingsOutlined,
  spark: AutoAwesomeOutlined, menu: MenuRounded, bookmark: BookmarkBorderRounded, chev: ExpandMoreRounded,
  chevr: ChevronRightRounded, chevl: ChevronLeftRounded, folder: FolderOutlined, check: CheckRounded, more: MoreHorizRounded,
  trash: DeleteOutlineRounded, undo: RestoreRounded, note: DescriptionOutlined, question: HelpOutlineRounded,
  open: OpenInNewRounded, pin: PushPinOutlined, globe: PublicRounded, loc: PlaceOutlined, info: InfoOutlined,
  tabs: TabRounded, grid: GridViewRounded, sleep: BedtimeOutlined, dl: DownloadRounded, private: VisibilityOutlined,
  square: CropSquareRounded, logo: LogoIcon,
} as const;

export type IconName = keyof typeof ICONS;

export default function Icon({ name, size = 16, ...rest }: { name: IconName; size?: number } & Omit<SvgIconProps, "fontSize">) {
  const C = ICONS[name];
  return <C aria-hidden="true" {...rest} sx={{ fontSize: size, flex: "none", ...((rest.sx as object) || {}) }} />;
}
