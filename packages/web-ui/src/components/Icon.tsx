import type { IconType } from "react-icons";
import {
  IoAddCircleOutline,
  IoAlert,
  IoArrowBack,
  IoArrowForward,
  IoArrowRedoOutline,
  IoCallOutline,
  IoChatbubbleEllipsesOutline,
  IoCheckmark,
  IoChevronDown,
  IoChevronForward,
  IoClose,
  IoCloudOfflineOutline,
  IoCompassOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoFileTrayFullOutline,
  IoHomeOutline,
  IoImageOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoLocate,
  IoLocationOutline,
  IoLockClosedOutline,
  IoMailOutline,
  IoMapOutline,
  IoMegaphoneOutline,
  IoNavigate,
  IoNewspaperOutline,
  IoNotificationsOutline,
  IoPhonePortraitOutline,
  IoRadioOutline,
  IoReceiptOutline,
  IoSearch,
  IoSettingsOutline,
  IoShareOutline,
  IoThumbsUpOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useTheme, type Palette } from "../theme";

/**
 * Ionicons by the names the native app uses with @expo/vector-icons. Only the
 * icons listed here are bundled; add a name here before using it.
 */
const IONICONS = {
  "add-circle-outline": IoAddCircleOutline,
  alert: IoAlert,
  "arrow-back": IoArrowBack,
  "arrow-forward": IoArrowForward,
  "arrow-redo-outline": IoArrowRedoOutline,
  "call-outline": IoCallOutline,
  "chatbubble-ellipses-outline": IoChatbubbleEllipsesOutline,
  checkmark: IoCheckmark,
  "chevron-down": IoChevronDown,
  "chevron-forward": IoChevronForward,
  close: IoClose,
  "cloud-offline-outline": IoCloudOfflineOutline,
  "compass-outline": IoCompassOutline,
  "document-text-outline": IoDocumentTextOutline,
  "download-outline": IoDownloadOutline,
  "file-tray-full-outline": IoFileTrayFullOutline,
  "home-outline": IoHomeOutline,
  "image-outline": IoImageOutline,
  "information-circle-outline": IoInformationCircleOutline,
  "list-outline": IoListOutline,
  locate: IoLocate,
  "location-outline": IoLocationOutline,
  "lock-closed-outline": IoLockClosedOutline,
  "mail-outline": IoMailOutline,
  "map-outline": IoMapOutline,
  "megaphone-outline": IoMegaphoneOutline,
  navigate: IoNavigate,
  "newspaper-outline": IoNewspaperOutline,
  "notifications-outline": IoNotificationsOutline,
  "phone-portrait-outline": IoPhonePortraitOutline,
  "radio-outline": IoRadioOutline,
  "receipt-outline": IoReceiptOutline,
  search: IoSearch,
  "settings-outline": IoSettingsOutline,
  "share-outline": IoShareOutline,
  "thumbs-up-outline": IoThumbsUpOutline,
  "time-outline": IoTimeOutline,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof IONICONS;

type IconProps = {
  name: IconName;
  /** Only Ionicons are used on the commuter side. */
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
