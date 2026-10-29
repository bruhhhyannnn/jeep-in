import type { IconType } from "react-icons";
import {
  IoAddCircleOutline,
  IoAlert,
  IoArrowBack,
  IoArrowForward,
  IoArrowRedoOutline,
  IoBusOutline,
  IoCallOutline,
  IoCarOutline,
  IoChatbubbleEllipsesOutline,
  IoCheckmark,
  IoChevronDown,
  IoChevronForward,
  IoClose,
  IoCloudOfflineOutline,
  IoCompassOutline,
  IoConstructOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoEllipsisHorizontal,
  IoFileTrayFullOutline,
  IoFlagOutline,
  IoHandLeftOutline,
  IoHomeOutline,
  IoImageOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoLocate,
  IoLocationOutline,
  IoLockClosedOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoMapOutline,
  IoMegaphoneOutline,
  IoMoon,
  IoNavigate,
  IoNewspaperOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoPhonePortraitOutline,
  IoPower,
  IoRadioOutline,
  IoReceiptOutline,
  IoRemoveCircleOutline,
  IoSearch,
  IoSend,
  IoSettingsOutline,
  IoShareOutline,
  IoSunny,
  IoSwapVertical,
  IoThumbsUpOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { useTheme, type Palette } from "../theme";

/**
 * Ionicons by the names the native app uses with @expo/vector-icons, for the
 * commuter and driver screens. Only the icons listed here are bundled; add a name
 * here before using it.
 */
const IONICONS = {
  "add-circle-outline": IoAddCircleOutline,
  alert: IoAlert,
  "arrow-back": IoArrowBack,
  "arrow-forward": IoArrowForward,
  "arrow-redo-outline": IoArrowRedoOutline,
  "bus-outline": IoBusOutline,
  "call-outline": IoCallOutline,
  "car-outline": IoCarOutline,
  "chatbubble-ellipses-outline": IoChatbubbleEllipsesOutline,
  checkmark: IoCheckmark,
  "chevron-down": IoChevronDown,
  "chevron-forward": IoChevronForward,
  close: IoClose,
  "cloud-offline-outline": IoCloudOfflineOutline,
  "compass-outline": IoCompassOutline,
  "construct-outline": IoConstructOutline,
  "document-text-outline": IoDocumentTextOutline,
  "download-outline": IoDownloadOutline,
  "ellipsis-horizontal": IoEllipsisHorizontal,
  "file-tray-full-outline": IoFileTrayFullOutline,
  "flag-outline": IoFlagOutline,
  "hand-left-outline": IoHandLeftOutline,
  "home-outline": IoHomeOutline,
  "image-outline": IoImageOutline,
  "information-circle-outline": IoInformationCircleOutline,
  "list-outline": IoListOutline,
  locate: IoLocate,
  "location-outline": IoLocationOutline,
  "lock-closed-outline": IoLockClosedOutline,
  "log-out-outline": IoLogOutOutline,
  "mail-outline": IoMailOutline,
  "map-outline": IoMapOutline,
  "megaphone-outline": IoMegaphoneOutline,
  moon: IoMoon,
  navigate: IoNavigate,
  "newspaper-outline": IoNewspaperOutline,
  "notifications-outline": IoNotificationsOutline,
  "person-outline": IoPersonOutline,
  "phone-portrait-outline": IoPhonePortraitOutline,
  power: IoPower,
  "radio-outline": IoRadioOutline,
  "receipt-outline": IoReceiptOutline,
  "remove-circle-outline": IoRemoveCircleOutline,
  search: IoSearch,
  send: IoSend,
  "settings-outline": IoSettingsOutline,
  "share-outline": IoShareOutline,
  sunny: IoSunny,
  "swap-vertical": IoSwapVertical,
  "thumbs-up-outline": IoThumbsUpOutline,
  "time-outline": IoTimeOutline,
  "warning-outline": IoWarningOutline,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof IONICONS;

type IconProps = {
  name: IconName;
  /** Only Ionicons are used on the web. */
  family?: "Ionicons";
  size?: number;
  /** Explicit colour; otherwise taken from `tone`. */
  color?: string;
  tone?: keyof Palette;
};

export default function Icon({ name, size = 20, color, tone = "ink" }: IconProps) {
  const { colors } = useTheme();
  const Glyph = IONICONS[name];
  return (
    <Glyph
      size={size}
      color={color ?? colors[tone]}
      aria-hidden
      focusable={false}
      style={{ flexShrink: 0 }}
    />
  );
}
