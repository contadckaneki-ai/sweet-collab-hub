import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getToken, fetchUserGuilds, getGuildIconUrl, isAuthenticated, type DiscordGuild } from "@/lib/discord";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  LayoutDashboard,
  Shield,
  Sliders,
  CreditCard,
  Link2,
  ShieldAlert,
  Blocks,
  UserCog,
  SmilePlus,
  ScrollText,
  HandMetal,
  Gavel,
  Hash,
  MessageSquare,
  ListChecks,
  Pin,
  FlaskConical,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Save,
  RotateCcw,
  Plus,
  Search,
  X,
  MessageCircle,
  LayoutGrid,
  LogOut,
  ShoppingBag,
  Volume2,
  Move,
  Mic,
  ClipboardList,
  Star,
  Users,
  Instagram,
  UserPlus,
  User,
  Ticket,
  Crown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Banner from "@/components/Banner";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  id: string;
  badge?: string;
  badgeColor?: string;
}

interface SidebarGroup {
  title?: string;
  collapsible?: boolean;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
      { icon: Settings, label: "Configurações", id: "settings" },
      { icon: Sliders, label: "Permissões", id: "permissions" },
      { icon: CreditCard, label: "Financeiro", id: "financial" },
    ],
  },
  {
    title: "PROTEÇÃO",
    collapsible: true,
    items: [
      { icon: Link2, label: "Proteção de Uri", id: "uri-protection" },
      { icon: ShieldAlert, label: "Proteção de Servidor", id: "server-protection", badge: "Update", badgeColor: "bg-primary" },
    ],
  },
  {
    title: "KALLY ENGINE",
    collapsible: true,
    items: [
      { icon: Blocks, label: "Custom Modules", id: "custom-modules", badge: "New", badgeColor: "bg-green-600" },
    ],
  },
  {
    title: "GERENCIAMENTO DE SERVIDOR",
    collapsible: true,
    items: [
      { icon: UserCog, label: "Autorole", id: "autorole", badge: "Update", badgeColor: "bg-primary" },
      { icon: SmilePlus, label: "Reações automática", id: "auto-reactions", badge: "Update", badgeColor: "bg-primary" },
      { icon: ScrollText, label: "Logs de Eventos", id: "event-logs", badge: "Update", badgeColor: "bg-primary" },
      { icon: HandMetal, label: "Bem vindo & Adeus", id: "welcome" },
      { icon: Gavel, label: "Moderação", id: "moderation", badge: "Update", badgeColor: "bg-primary" },
      { icon: Hash, label: "Contadores", id: "counters", badge: "Update", badgeColor: "bg-primary" },
      { icon: MessageSquare, label: "Mensagens", id: "messages" },
      { icon: ListChecks, label: "Whitelist", id: "whitelist", badge: "Update", badgeColor: "bg-primary" },
      { icon: FlaskConical, label: "Bio Checker", id: "bio-checker", badge: "Update", badgeColor: "bg-primary" },
      { icon: Pin, label: "Utilitários", id: "utilities", badge: "Update", badgeColor: "bg-primary" },
    ],
  },
  {
    title: "ECONOMIA",
    collapsible: true,
    items: [
      { icon: ShoppingBag, label: "Loja", id: "shop", badge: "New", badgeColor: "bg-green-600" },
    ],
  },
  {
    title: "STAFF",
    collapsible: true,
    items: [
      { icon: Volume2, label: "Tempo em Call", id: "call-time" },
      { icon: Move, label: "Mov. Chat", id: "mov-chat" },
      { icon: Mic, label: "Mig & Rec", id: "mig-rec", badge: "Update", badgeColor: "bg-primary" },
      { icon: ClipboardList, label: "Registro", id: "registro" },
    ],
  },
  {
    title: "SOCIAL",
    collapsible: true,
    items: [
      { icon: Star, label: "Primeira Dama", id: "primeira-dama", badge: "Update", badgeColor: "bg-primary" },
      { icon: Users, label: "Panela", id: "panela", badge: "New", badgeColor: "bg-green-600" },
      { icon: Instagram, label: "Instagram", id: "instagram", badge: "Update", badgeColor: "bg-primary" },
      { icon: UserPlus, label: "Influencers", id: "influencers", badge: "Update", badgeColor: "bg-primary" },
      { icon: User, label: "Tellonym", id: "tellonym", badge: "Update", badgeColor: "bg-primary" },
    ],
  },
  {
    title: "MISCHELLANEOUS",
    collapsible: true,
    items: [
      { icon: Ticket, label: "Tickets", id: "tickets", badge: "Update", badgeColor: "bg-primary" },
      { icon: Crown, label: "Vips", id: "vips" },
    ],
  },
];

// servers map removed — now fetched from Discord API

const mockRoles = [
  { id: "1", name: "zamigaet svet" },
  { id: "2", name: "Jockie Music" },
  { id: "3", name: "Kally Premium" },
  { id: "4", name: "Moderador" },
  { id: "5", name: "Admin" },
  { id: "6", name: "VIP" },
];

const mockVoiceChannels = [
  { id: "vc1", name: "🔊 Geral", type: "voice" as const },
  { id: "vc2", name: "🔊 Gaming", type: "voice" as const },
  { id: "vc3", name: "🔊 Music", type: "voice" as const },
  { id: "cat1", name: "📁 Text Channels", type: "category" as const },
  { id: "cat2", name: "📁 Voice Channels", type: "category" as const },
  { id: "cat3", name: "📁 Staff", type: "category" as const },
];

const mockTextChannels = [
  { id: "tc1", name: "# geral" },
  { id: "tc2", name: "# comandos" },
  { id: "tc3", name: "# staff-chat" },
  { id: "tc4", name: "# logs" },
  { id: "tc5", name: "# bate-papo" },
];
interface AllSettings {
  prefix: string;
  botName: string;
  deleteMessage: boolean;
  slashCommands: boolean;
  addedRoles: { id: string; name: string }[];
  addedMembers: { id: string; name: string }[];
  uriProtectionEnabled: boolean;
  uriAccount: string;
  uriOriginal: string;
  uriLogChannel: string;
  uriPunishment: string;
  serverProtectionEnabled: boolean;
  fakeAccountDays: string;
  ignoredRoleProtection: string;
  blockBots: boolean;
  bkGlobalLimit: boolean;
  bkActionLimit: string;
  bkTime: string;
  bkLogChannel: string;
  bkPunishment: string;
  bkRevertActions: boolean;
  bkBlockBans: boolean;
  bkBlockKicks: boolean;
  castActionLimit: string;
  castTime: string;
  castLogChannel: string;
  castPunishment: string;
  castRevertActions: boolean;
  castBlockManual: boolean;
  chGlobalLimit: boolean;
  chActionLimit: string;
  chTime: string;
  chLogChannel: string;
  chPunishment: string;
  chRevertActions: boolean;
  roleGlobalLimit: boolean;
  roleActionLimit: string;
  roleTime: string;
  roleLogChannel: string;
  rolePunishment: string;
  roleRevertActions: boolean;
  roleBlockedRole: string;
  rolePermissions: Record<string, boolean>;
  mgWhitelistRole: string;
  mgPunishment: string;
  mgLogChannel: string;
  cmdAddrole: boolean;
  cmdRemoverole: boolean;
  autoroleEnabled: boolean;
  autoroleRole: string;
  autoroleEmblems: Record<string, string>;
  moderationEnabled: boolean;
  modAutoSpam: string;
  modBlockedWords: string;
  modDuplicateText: string;
  modAntiInvites: string;
  modAntiLinks: string;
  modExcessCaps: string;
  modExcessEmojis: string;
  modExcessMentions: string;
  modZalgo: string;
  modImmunityRoles: string;
  modMutedRole: string;
  modSpamLimit: number;
  modSpamSeconds: number;
  modBlockedExact: string[];
  modBlockedPartial: string[];
  modAllowedLinks: string[];
  modEmojiLimit: number;
  modMentionLimit: number;
  modNotifyBans: boolean;
  modNotifyKicks: boolean;
  modNotifyWarns: boolean;
  modLogBans: string;
  modLogMutes: string;
  modLogKicks: string;
  modLogWarns: string;
  modLogPunishments: string;
  modRestrictionRoles: string;
  modRestrictionUsers: string;
  modRestrictionLogChannel: string;
  modCommands: Record<string, boolean>;
  settingsChannels: string;
  modSpamDisabledChannel: string;
  modSpamDisabledRole: string;
  eventLogsEnabled: boolean;
  evFinanceiro: string;
  evEntradaBot: string;
  evMsgEditada: string;
  evMsgDeletada: string;
  evComandos: string;
  evCanaisVoz: string;
  evEntradaMembro: string;
  evSaidaMembro: string;
  evCargoAdicionado: string;
  evCargoRemovido: string;
  evCargoCriado: string;
  evCargoAtualizado: string;
  evCargoDeletado: string;
  evCanalCriado: string;
  evCanalAtualizado: string;
  evCanalDeletado: string;
  countersEnabled: boolean;
  cntMembrosCanal: string;
  cntMembrosMsg: string;
  cntMembrosEmojis: Record<string, string>;
  cntCallCanal: string;
  cntCallMsg: string;
  bioCheckerEnabled: boolean;
  bioTokens: string;
  bioLogChannel: string;
  bioRoles: { id: string; name: string }[];
  bioProfileText: string;
  bioPostChannel: string;
  bioBuilderMode: string;
  bioMessageText: string;
  bioMentionEveryone: boolean;
  bioMentionRoles: boolean;
  bioMentionUsers: boolean;
  bioVerifyText: string;
  bioVerifyRoles: { id: string; name: string }[];
  whitelistEnabled: boolean;
  wlApprovalChannel: string;
  wlLogChannel: string;
  wlApproveRoles: { id: string; name: string }[];
  wlWhitelistRolesMode: string;
  wlWhitelistRoles: { id: string; name: string }[];
  wlVerifiedRoles: { id: string; name: string }[];
  wlVerificationType: string;
  wlMentionedUserOnly: boolean;
  wlCodeSystem: boolean;
  wlCodeRoles: { id: string; name: string }[];
  wlMessageChannel: string;
  wlBuilderMode: string;
  wlMessageText: string;
  wlMentionEveryone: boolean;
  wlMentionRoles: boolean;
  wlMentionUsers: boolean;
  wlVerifyBtnLabel: string;
  wlCodeBtnLabel: string;
  callTimeEnabled: boolean;
  callTimeRoles: { id: string; name: string }[];
  callTimeChannels: { id: string; name: string; percentage: number }[];
  callTimeCountMuted: boolean;
  callTimeCmdResettime: boolean;
  callTimeCmdResetmovs: boolean;
  callTimeCmdMovpoints: boolean;
  callTimeMovEnabled: boolean;
  callTimeMovAllowChannelSwitch: boolean;
  callTimeMovDuration: string;
  callTimeMovPoints: string;
  callTimeMovLogChannel: string;
  movChatEnabled: boolean;
  movChatRoles: { id: string; name: string }[];
  movChatChannels: { id: string; name: string }[];
  movChatMessageLimit: number;
  movChatSeconds: number;
  movChatCmdResetmovchat: boolean;
  instagramEnabled: boolean;
  instagramMessageModel: string;
  instagramChannel: string;
  instagramResultsChannel: string;
  instagramRewardRole: string;
  instagramAllowLink: boolean;
  instagramRequireLink: boolean;
  instagramVerifyLogChannel: string;
  instagramVerifyRoles: { id: string; name: string }[];
  instagramVerifiedRoles: { id: string; name: string }[];
  instagramConfigs: { id: number; name: string }[];
  instagramCommands: Record<string, boolean>;
}

const defaultAllSettings: AllSettings = {
  prefix: "k.",
  botName: "kally",
  deleteMessage: false,
  slashCommands: true,
  addedRoles: [{ id: "5", name: "Admin" }, { id: "4", name: "Moderador" }],
  addedMembers: [{ id: "m1", name: "usuario#1234" }, { id: "m2", name: "jogador#5678" }],
  uriProtectionEnabled: false,
  uriAccount: "",
  uriOriginal: "",
  uriLogChannel: "disabled",
  uriPunishment: "remove-roles",
  serverProtectionEnabled: false,
  fakeAccountDays: "0",
  ignoredRoleProtection: "",
  blockBots: false,
  bkGlobalLimit: true,
  bkActionLimit: "3",
  bkTime: "1",
  bkLogChannel: "disabled",
  bkPunishment: "remove-roles",
  bkRevertActions: true,
  bkBlockBans: false,
  bkBlockKicks: false,
  castActionLimit: "3",
  castTime: "1",
  castLogChannel: "disabled",
  castPunishment: "remove-roles",
  castRevertActions: false,
  castBlockManual: false,
  chGlobalLimit: true,
  chActionLimit: "3",
  chTime: "1",
  chLogChannel: "disabled",
  chPunishment: "remove-roles",
  chRevertActions: false,
  roleGlobalLimit: true,
  roleActionLimit: "3",
  roleTime: "1",
  roleLogChannel: "disabled",
  rolePunishment: "remove-roles",
  roleRevertActions: false,
  roleBlockedRole: "",
  rolePermissions: { admin: false, ban: true, kick: true, manageRoles: true, manageChannels: true, manageServer: true },
  mgWhitelistRole: "",
  mgPunishment: "revert",
  mgLogChannel: "disabled",
  cmdAddrole: true,
  cmdRemoverole: true,
  autoroleEnabled: false,
  autoroleRole: "",
  autoroleEmblems: {
    staff: "disabled", parceiro: "disabled", hypesquad: "disabled",
    bugHunter: "disabled", bugHunterGold: "disabled", hypesquadBravery: "disabled",
    hypesquadBriliance: "disabled", hypesquadBalance: "disabled", apoiadorInicial: "disabled",
    devVerificado: "disabled", devAtivo: "disabled", modCertificado: "disabled",
  },
  moderationEnabled: false,
  modAutoSpam: "disabled", modBlockedWords: "disabled", modDuplicateText: "disabled",
  modAntiInvites: "disabled", modAntiLinks: "disabled", modExcessCaps: "disabled",
  modExcessEmojis: "disabled", modExcessMentions: "disabled", modZalgo: "disabled",
  modImmunityRoles: "", modMutedRole: "",
  modSpamLimit: 4, modSpamSeconds: 1,
  modBlockedExact: [], modBlockedPartial: [],
  modAllowedLinks: ["*.gif", "*.jpg", "*.jpeg", "*.png", "*.webp", "http://tenor.com/*", "https://tenor.com/*"],
  modEmojiLimit: 7, modMentionLimit: 5,
  modNotifyBans: false, modNotifyKicks: false, modNotifyWarns: false,
  modLogBans: "disabled", modLogMutes: "disabled", modLogKicks: "disabled",
  modLogWarns: "disabled", modLogPunishments: "disabled",
  modRestrictionRoles: "", modRestrictionUsers: "", modRestrictionLogChannel: "disabled",
  modCommands: {
    ban: true, unban: true, kick: true, mute: true, unmute: true, mutecall: true,
    unmutecall: true, lock: true, unlock: true, unbanall: true, blacklist: true,
    advertence: true, removeadvertence: true, castigar: true, removecastigo: true, nuke: true,
  },
  settingsChannels: "",
  modSpamDisabledChannel: "",
  modSpamDisabledRole: "",
  eventLogsEnabled: false,
  evFinanceiro: "disabled", evEntradaBot: "disabled",
  evMsgEditada: "disabled", evMsgDeletada: "disabled",
  evComandos: "disabled", evCanaisVoz: "disabled", evEntradaMembro: "disabled",
  evSaidaMembro: "disabled", evCargoAdicionado: "disabled", evCargoRemovido: "disabled",
  evCargoCriado: "disabled", evCargoAtualizado: "disabled", evCargoDeletado: "disabled",
  evCanalCriado: "disabled", evCanalAtualizado: "disabled", evCanalDeletado: "disabled",
  countersEnabled: false,
  cntMembrosCanal: "disabled",
  cntMembrosMsg: "",
  cntMembrosEmojis: { "0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "" },
  cntCallCanal: "disabled",
  cntCallMsg: "Membros em call: %",
  bioCheckerEnabled: false,
  bioTokens: "",
  bioLogChannel: "disabled",
  bioRoles: [],
  bioProfileText: "",
  bioPostChannel: "disabled",
  bioBuilderMode: "message-builder",
  bioMessageText: "",
  bioMentionEveryone: true,
  bioMentionRoles: true,
  bioMentionUsers: true,
  bioVerifyText: "",
  bioVerifyRoles: [],
  whitelistEnabled: false,
  wlApprovalChannel: "disabled",
  wlLogChannel: "disabled",
  wlApproveRoles: [],
  wlWhitelistRolesMode: "allow-except",
  wlWhitelistRoles: [],
  wlVerifiedRoles: [],
  wlVerificationType: "user",
  wlMentionedUserOnly: false,
  wlCodeSystem: true,
  wlCodeRoles: [],
  wlMessageChannel: "disabled",
  wlBuilderMode: "message-builder",
  wlMessageText: "",
  wlMentionEveryone: true,
  wlMentionRoles: true,
  wlMentionUsers: true,
  wlVerifyBtnLabel: "Verificar",
  wlCodeBtnLabel: "Utilizar Código",
  callTimeEnabled: false,
  callTimeRoles: [],
  callTimeChannels: [],
  callTimeCountMuted: false,
  callTimeCmdResettime: true,
  callTimeCmdResetmovs: true,
  callTimeCmdMovpoints: true,
  callTimeMovEnabled: false,
  callTimeMovAllowChannelSwitch: false,
  callTimeMovDuration: "60",
  callTimeMovPoints: "1",
  callTimeMovLogChannel: "disabled",
  movChatEnabled: false,
  movChatRoles: [],
  movChatChannels: [],
  movChatMessageLimit: 1,
  movChatSeconds: 1,
  movChatCmdResetmovchat: true,
  instagramEnabled: false,
  instagramMessageModel: "new",
  instagramChannel: "disabled",
  instagramResultsChannel: "disabled",
  instagramRewardRole: "disabled",
  instagramAllowLink: true,
  instagramRequireLink: false,
  instagramVerifyLogChannel: "disabled",
  instagramVerifyRoles: [],
  instagramVerifiedRoles: [],
  instagramConfigs: [],
  instagramCommands: {
    resetverificacoes: true,
    instagram: true,
  },
};

const emblemsList = [
  { key: "staff", label: "Emblema de Staff", icon: "⚒️" },
  { key: "parceiro", label: "Emblema de Parceiro", icon: "👀" },
  { key: "hypesquad", label: "Emblema de Hypesquad", icon: "🏆" },
  { key: "bugHunter", label: "Emblema de Bug Hunter", icon: "🐛" },
  { key: "bugHunterGold", label: "Emblema de Bug Hunter Gold", icon: "🐛" },
  { key: "hypesquadBravery", label: "Emblema de Hypesquad Bravery", icon: "💜" },
  { key: "hypesquadBriliance", label: "Emblema de Hypesquad Briliance", icon: "❤️" },
  { key: "hypesquadBalance", label: "Emblema de Hypesquad Balance", icon: "💚" },
  { key: "apoiadorInicial", label: "Emblema de Apoiador Inicial", icon: "💰" },
  { key: "devVerificado", label: "Emblema de Desenvolvedor Verificado", icon: "🔵" },
  { key: "devAtivo", label: "Emblema de Desenvolvedor Ativo", icon: "🟢" },
  { key: "modCertificado", label: "Emblema de Moderador Certificado", icon: "🟣" },
];

const serverProtectionTabs = ["Geral", "Bans/Kicks", "Castigos", "Canais", "Cargos", "Cargos Gerenciados", "Comandos"];

const ServerSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guild, setGuild] = useState<DiscordGuild | null>(null);
  const [activeSection, setActiveSection] = useState("settings");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const [saved, setSaved] = useState<AllSettings>(structuredClone(defaultAllSettings));
  const [current, setCurrent] = useState<AllSettings>(structuredClone(defaultAllSettings));

  const [permissionsTab, setPermissionsTab] = useState<"roles" | "members">("roles");
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const [rolesSearch, setRolesSearch] = useState("");
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const rolesDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedRole, setSelectedRole] = useState<{ id: string; name: string } | null>(null);
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null);
  const [permToggles, setPermToggles] = useState<Record<string, boolean>>({});
  const [savedPermToggles, setSavedPermToggles] = useState<Record<string, boolean>>({});
  const [serverProtectionTab, setServerProtectionTab] = useState("geral");
  const [cmdSearch, setCmdSearch] = useState("");
  const [mgAddCargoOpen, setMgAddCargoOpen] = useState(false);
  const [mgCargoSearch, setMgCargoSearch] = useState("");
  const mgAddCargoRef = useRef<HTMLDivElement>(null);
  const [moderationTab, setModerationTab] = useState("automod");
  const [modCmdSearch, setModCmdSearch] = useState("");
  const [modDetailOpen, setModDetailOpen] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<Array<{ id: number; cargo: string; tempo: string; punicao: string }>>([]);
  const [openWarningId, setOpenWarningId] = useState<number | null>(null);
  const [wlQuestions, setWlQuestions] = useState<Array<{ id: number; nome: string; placeholder: string; estilo: string; tamanhoMin: number; tamanhoMax: number; obrigatoria: boolean }>>([]);
  const [savedWlQuestions, setSavedWlQuestions] = useState<Array<{ id: number; nome: string; placeholder: string; estilo: string; tamanhoMin: number; tamanhoMax: number; obrigatoria: boolean }>>([]);
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
  const [wlQuestionCounter, setWlQuestionCounter] = useState(1);
  const [modBlockedExactInput, setModBlockedExactInput] = useState("");
  const [modBlockedPartialInput, setModBlockedPartialInput] = useState("");
  const [modLinkInput, setModLinkInput] = useState("");
  const [callTimeTab, setCallTimeTab] = useState("configuracao");
  const [movChatTab, setMovChatTab] = useState("configuracao");
  const [instagramTab, setInstagramTab] = useState("configuracao");
  const [instagramCmdSearch, setInstagramCmdSearch] = useState("");
  const [instagramConfigOpen, setInstagramConfigOpen] = useState<number | null>(null);
  const [instagramCreated, setInstagramCreated] = useState(false);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const update = <K extends keyof AllSettings>(key: K, value: AllSettings[K]) => {
    setCurrent((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRoles = mockRoles.filter(
    (r) => r.name.toLowerCase().includes(rolesSearch.toLowerCase()) && !current.addedRoles.some((ar) => ar.id === r.id)
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(e.target as Node)) {
        setShowRolesDropdown(false);
      }
      if (mgAddCargoRef.current && !mgAddCargoRef.current.contains(e.target as Node)) {
        setMgAddCargoOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasChanges = useMemo(() => JSON.stringify(current) !== JSON.stringify(saved) || JSON.stringify(permToggles) !== JSON.stringify(savedPermToggles) || JSON.stringify(wlQuestions) !== JSON.stringify(savedWlQuestions), [current, saved, permToggles, savedPermToggles, wlQuestions, savedWlQuestions]);

  const handleSave = useCallback(() => { setSaved(structuredClone(current)); setSavedPermToggles(structuredClone(permToggles)); setSavedWlQuestions(structuredClone(wlQuestions)); }, [current, permToggles, wlQuestions]);
  const handleDiscard = useCallback(() => { setCurrent(structuredClone(saved)); setPermToggles(structuredClone(savedPermToggles)); setWlQuestions(structuredClone(savedWlQuestions)); }, [saved, savedPermToggles, savedWlQuestions]);

  const serverName = guild?.name || "Servidor";
  const serverIcon = guild ? getGuildIconUrl(guild) : null;

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/", { replace: true }); return; }
    const token = getToken()!;
    fetchUserGuilds(token).then((guilds) => {
      const found = guilds.find((g) => g.id === id);
      if (found) setGuild(found);
    });
  }, [id, navigate]);
  const toggleGroup = (title: string) => setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));

  const sp = current.serverProtectionEnabled;

  const renderSettingsContent = () => (
    <>
      <h1 className="font-display text-3xl font-bold">Configurações</h1>
      <p className="mt-1 text-muted-foreground">Configure as principais informações de funcionamento</p>
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Configurações de comando</h2>
        <div className="mt-6 rounded-lg border border-border/50 bg-card p-6">
          <div className="border-l-2 border-primary pl-4">
            <p className="text-sm font-medium">Configure o prefixo para comandos em mensagem</p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Prefixo</label>
              <Input value={current.prefix} onChange={(e) => update("prefix", e.target.value)} className="bg-background border-border" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Nome do CL</label>
              <Input value={current.botName} onChange={(e) => update("botName", e.target.value)} className="bg-background border-border" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-0 divide-y divide-border/50 rounded-lg border border-border/50 bg-card">
        <div className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-sm font-semibold">Deletar mensagem</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ao executar um comando, irei deletar a mensagem do usuário</p>
          </div>
          <Switch checked={current.deleteMessage} onCheckedChange={(v) => update("deleteMessage", v)} />
        </div>
        <div className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-sm font-semibold">Permitir comandos em Slash</h3>
            <p className="mt-1 text-sm text-muted-foreground">Permitir que usuários utilizem comandos com "/"</p>
          </div>
          <Switch checked={current.slashCommands} onCheckedChange={(v) => update("slashCommands", v)} />
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-border/50 bg-card p-6">
        <div className="border-l-2 border-primary pl-4">
          <p className="text-sm font-medium">Os comandos da Kally funcionarão apenas em canais selecionados por você</p>
        </div>
        <div className="mt-6">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canais: 0</label>
          <Select value={current.settingsChannels} onValueChange={(v) => update("settingsChannels", v)}>
            <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione canais" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">general</SelectItem>
              <SelectItem value="commands">commands</SelectItem>
              <SelectItem value="bot">bot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  const permissionCategories = [
    {
      title: "GERAL",
      color: "border-red-500",
      permissions: [
        { key: "posse", name: "Posse", desc: "Membros com essa permissão têm acesso a todas as funcionalidades do site." },
        { key: "visualizar_financas", name: "Visualizar Finanças", desc: "Permite que os membros visualizem as informações referente à inscrição premium do servidor." },
        { key: "mudar_aparencia", name: "Mudar Aparência", desc: "Permite que os membros mudam a aparência do bot, como nome e avatar." },
        { key: "gerenciar_bot", name: "Gerenciar Bot", desc: "Permite que os membros mudam as informações iniciais do bot." },
        { key: "gerenciar_permissoes", name: "Gerenciar Permissões", desc: "Permite que os membros mudam as permissões de outros membros ou cargos no site ou bot." },
      ],
    },
    {
      title: "KALLY ENGINE",
      color: "border-purple-500",
      permissions: [
        { key: "gerenciar_custom_modules", name: "Gerenciar Custom Modules", desc: "Permite que os membros gerenciem custom modules." },
        { key: "gerenciar_datasets", name: "Gerenciar Datasets", desc: "Permite que os membros gerenciem datasets." },
      ],
    },
    {
      title: "PLUGINS",
      color: "border-green-500",
      permissions: [
        { key: "gerenciar_protecao_url", name: "Gerenciar Proteção de Url", desc: "Permite que os membros mudam as configurações de proteção de url do servidor." },
        { key: "gerenciar_protecao_servidor", name: "Gerenciar Proteção de Servidor", desc: "Permite que os membros mudam as configurações de anti raid do servidor." },
        { key: "gerenciar_autorole", name: "Gerenciar Autorole", desc: "Permite que os membros mudam cargos atribuídos a novos membros." },
        { key: "gerenciar_reacoes_automaticas", name: "Gerenciar Reações Automáticas", desc: "Permite que os membros mudam as configurações de reação automática." },
        { key: "gerenciar_logs_eventos", name: "Gerenciar Logs de Eventos", desc: "Permite que os membros mudam as configurações de logs de eventos do servidor." },
        { key: "gerenciar_bem_vindo", name: "Gerenciar Bem vindo & Adeus", desc: "Permite que os membros mudam as configurações de mensagens de entrada e saída do servidor." },
        { key: "gerenciar_moderacao", name: "Gerenciar Moderação", desc: "Permite que os membros mudam as configurações de moderação dentro do servidor." },
        { key: "gerenciar_contadores", name: "Gerenciar Contadores", desc: "Permite que os membros mudam as configurações de contadores dentro do servidor." },
        { key: "gerenciar_mensagens", name: "Gerenciar Mensagens", desc: "Permite que os membros mudam as configurações de mensagens dentro do servidor." },
        { key: "gerenciar_utilitarios", name: "Gerenciar Utilitários", desc: "Permite que os membros mudam as configurações de comandos úteis dentro do servidor." },
        { key: "gerenciar_primeira_dama", name: "Gerenciar Primeira Dama", desc: "Permite que os membros mudem o cargo de primeira dama, vejam as todas damas do servidor e alterem o limite de damas para cada cargo." },
        { key: "gerenciar_paineis", name: "Gerenciar Painéis", desc: "Permite que os membros configurem os cargos da painéis, limites e permissões de acesso ao sistema de painéis." },
        { key: "gerenciar_tempo_call", name: "Gerenciar Tempo em Call", desc: "Permite que os membros mudam as configurações de tempo em call." },
        { key: "gerenciar_mov_chat", name: "Gerenciar Mov. Chat", desc: "Permite que os membros mudam as configurações do Mov. Chat." },
        { key: "gerenciar_registro", name: "Gerenciar Registro", desc: "Permite que os membros mudam as configurações de registro do servidor." },
        { key: "gerenciar_instagram", name: "Gerenciar Instagram", desc: "Permite que os membros mudam as configurações de instagram dentro do servidor." },
        { key: "gerenciar_influencers", name: "Gerenciar Influencers", desc: "Permite que os membros mudam as configurações de influencers dentro do servidor." },
        { key: "gerenciar_tellonym", name: "Gerenciar Tellonym", desc: "Permite que os membros mudam as configurações de tellonym do servidor." },
        { key: "gerenciar_tickets", name: "Gerenciar Tickets", desc: "Permite que os membros mudam as configurações de tickets do servidor." },
        { key: "gerenciar_vips", name: "Gerenciar Vips", desc: "Permite que os membros mudam as configurações de vips do servidor." },
        { key: "gerenciar_loja", name: "Gerenciar Loja", desc: "Permite que os membros mudam as configurações da loja, itens, missões e conversões." },
      ],
    },
  ];

  const selectedItem = permissionsTab === "roles" ? selectedRole : selectedMember;

  const renderPermissionsPanel = () => {
    if (!selectedItem) return null;
    return (
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-6">
          Você está editando as permissões de <span className="font-bold text-foreground">{selectedItem.name}</span>
        </p>
        <div className="space-y-2">
          {permissionCategories.map((cat) => (
            <div key={cat.title}>
              <div className={`border-l-2 ${cat.color} pl-3 mb-2`}>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{cat.title}</span>
              </div>
              <div className="divide-y divide-border/30">
                {cat.permissions.map((perm) => (
                  <div key={perm.key} className="flex items-center justify-between py-3 px-1">
                    <div>
                      <p className="text-sm font-semibold text-primary">{perm.name}</p>
                      <p className="text-xs text-muted-foreground">{perm.desc}</p>
                    </div>
                    <Switch
                      checked={permToggles[`${selectedItem.id}_${perm.key}`] || false}
                      onCheckedChange={(v) => setPermToggles((prev) => ({ ...prev, [`${selectedItem.id}_${perm.key}`]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button variant="destructive" className="w-full">Deletar</Button>
        </div>
      </div>
    );
  };

  const renderPermissionsContent = () => (
    <>
      <h1 className="font-display text-3xl font-bold">Permissões</h1>
      <p className="mt-1 text-muted-foreground">Configure as permissões de acesso ao sistema</p>
      <div className="mt-8 flex gap-6 border-b border-border/50">
        <button onClick={() => { setPermissionsTab("roles"); setSelectedMember(null); }} className={`pb-3 text-sm font-semibold transition-colors ${permissionsTab === "roles" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Cargos</button>
        <button onClick={() => { setPermissionsTab("members"); setSelectedRole(null); }} className={`pb-3 text-sm font-semibold transition-colors ${permissionsTab === "members" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Membros</button>
      </div>
      <div className="mt-6 flex gap-6">
        <div className="w-44 shrink-0">
          <div className="rounded-lg border border-border/50 bg-card">
            <div className="relative" ref={rolesDropdownRef}>
              <div className="flex items-center justify-between border-l-2 border-primary pl-3 pr-3 py-3">
                <p className="text-xs font-medium">{permissionsTab === "roles" ? "Lista de cargos" : "Lista de membros"}</p>
                {permissionsTab === "roles" ? (
                  <button onClick={() => { setShowRolesDropdown(!showRolesDropdown); setRolesSearch(""); }} className="flex h-5 w-5 items-center justify-center rounded border border-border/50 bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Plus className="h-3 w-3" />
                  </button>
                ) : (
                  <button onClick={() => { setShowMemberSearch(!showMemberSearch); setMemberSearch(""); }} className="flex h-5 w-5 items-center justify-center rounded border border-border/50 bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {showRolesDropdown && permissionsTab === "roles" && (
                  <motion.div initial={{ opacity: 0, y: -5, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute left-0 top-full z-[100] mt-1 w-56 rounded-lg border border-border bg-background shadow-xl" style={{ backgroundColor: 'hsl(var(--background))' }}>
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Pesquisar" value={rolesSearch} onChange={(e) => setRolesSearch(e.target.value)} className="h-8 bg-background border-border pl-8 text-sm" autoFocus />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto px-1 pb-1">
                      {filteredRoles.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-muted-foreground">Nenhum cargo encontrado</p>
                      ) : (
                        filteredRoles.map((role) => (
                          <button key={role.id} onClick={() => { update("addedRoles", [...current.addedRoles, role]); setShowRolesDropdown(false); setSelectedRole(role); }} className="flex w-full items-center rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted">{role.name}</button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="divide-y divide-border/30">
              {permissionsTab === "roles" ? (
                current.addedRoles.map((role) => (
                  <button key={role.id} onClick={() => setSelectedRole(role)} className={`flex w-full items-center px-3 py-2.5 text-xs transition-colors ${selectedRole?.id === role.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
                    <span className="truncate">@{role.name}</span>
                  </button>
                ))
              ) : (
                current.addedMembers.map((member) => (
                  <button key={member.id} onClick={() => setSelectedMember(member)} className={`flex w-full items-center px-3 py-2.5 text-xs transition-colors ${selectedMember?.id === member.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
                    <span className="truncate">@{member.name}</span>
                  </button>
                ))
              )}
            </div>
            {permissionsTab === "members" && (
              <AnimatePresence>
                {showMemberSearch && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-border/30">
                    <div className="p-2">
                      <div className="flex items-center gap-1">
                        <Input placeholder="ID ou nome" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="h-7 bg-background border-border text-xs" autoFocus />
                        <Button size="icon" variant="outline" className="shrink-0 h-7 w-7 border-border" onClick={() => {
                          if (memberSearch.trim()) {
                            const newMember = { id: `m${Date.now()}`, name: memberSearch.trim() };
                            update("addedMembers", [...current.addedMembers, newMember]);
                            setMemberSearch("");
                            setShowMemberSearch(false);
                            setSelectedMember(newMember);
                          }
                        }}>
                          <Search className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
        {selectedItem ? renderPermissionsPanel() : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-20">
            Selecione um {permissionsTab === "roles" ? "cargo" : "membro"} para editar as permissões
          </div>
        )}
      </div>
    </>
  );

  const renderUriProtectionContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Proteção de Url</h1>
          <p className="mt-1 text-muted-foreground">Mantenha a url do seu servidor protegida e evite que pessoas má intencionadas tomem posse.</p>
        </div>
        <Switch checked={current.uriProtectionEnabled} onCheckedChange={(v) => update("uriProtectionEnabled", v)} />
      </div>
      <div className="relative mt-8">
        <AnimatePresence>
          {!current.uriProtectionEnabled && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
              <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Link2 className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display text-lg font-bold">Proteção De Url</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mantenha a url do seu servidor protegida e evite que pessoas má intencionadas tomem posse.</p>
                <Button onClick={() => update("uriProtectionEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-6">
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="border-l-2 border-primary pl-4 flex items-center gap-2">
              <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">New</span>
              <p className="text-sm font-medium">Conta (Veja nosso tutorial no servidor de suporte em caso de dúvidas)</p>
            </div>
            <div className="mt-4">
              <Input value={current.uriAccount} onChange={(e) => update("uriAccount", e.target.value)} className="bg-background border-border max-w-lg" disabled={!current.uriProtectionEnabled} />
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">URL Original</p></div>
            <div className="mt-4 flex items-center gap-0">
              <span className="rounded-l-md border border-r-0 border-border bg-muted px-3 py-2 text-sm text-muted-foreground">discord.gg/</span>
              <Input value={current.uriOriginal} onChange={(e) => update("uriOriginal", e.target.value)} className="rounded-l-none bg-background border-border max-w-xs" disabled={!current.uriProtectionEnabled} />
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Defina um canal de logs para a proteção</p></div>
            <div className="mt-4">
              <Select value={current.uriLogChannel} onValueChange={(v) => update("uriLogChannel", v)} disabled={!current.uriProtectionEnabled}>
                <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="disabled">Desativado</SelectItem><SelectItem value="general">general</SelectItem><SelectItem value="logs">logs</SelectItem><SelectItem value="mod-logs">mod-logs</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Punição aplicada ao alterar a url do servidor</p></div>
            <div className="mt-4">
              <Select value={current.uriPunishment} onValueChange={(v) => update("uriPunishment", v)} disabled={!current.uriProtectionEnabled}>
                <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="remove-roles">Remover todos os cargos</SelectItem><SelectItem value="kick">Expulsar do servidor</SelectItem><SelectItem value="ban">Banir do servidor</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderServerProtectionContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">Proteção de Servidor</h1>
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
          </div>
          <p className="mt-1 text-muted-foreground">Mantenha seu servidor protegido contra ataques.</p>
        </div>
        <Switch checked={sp} onCheckedChange={(v) => update("serverProtectionEnabled", v)} />
      </div>
      <div className="relative mt-8">
        <AnimatePresence>
          {!sp && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
              <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><ShieldAlert className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display text-lg font-bold">Proteção De Servidor</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mantenha seu servidor protegido contra ataques.</p>
                <Button onClick={() => update("serverProtectionEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-border/50 overflow-x-auto">
            {serverProtectionTabs.map((tab) => {
              const tabId = tab.toLowerCase().replace(/\//g, "-").replace(/ /g, "-");
              return (
                <button key={tab} onClick={() => sp && setServerProtectionTab(tabId)} className={`whitespace-nowrap pb-3 text-sm font-semibold transition-colors ${serverProtectionTab === tabId ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"} ${!sp ? "pointer-events-none" : ""}`}>{tab}</button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={serverProtectionTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
              {serverProtectionTab === "geral" && (
                <>
                  <div className="rounded-lg border border-border/50 bg-card p-6">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure a proteção contra fakes (Deixe em 0 para desativar)</p></div>
                    <div className="mt-4">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempo de criação de conta (em dias)</label>
                      <Input value={current.fakeAccountDays} onChange={(e) => update("fakeAccountDays", e.target.value)} className="bg-background border-border max-w-xs" disabled={!sp} />
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Ignorar cargos</p></div>
                    <div className="mt-4">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Cargos: 0</label>
                      <Select value={current.ignoredRoleProtection} onValueChange={(v) => update("ignoredRoleProtection", v)} disabled={!sp}>
                        <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um cargo" /></SelectTrigger>
                        <SelectContent>{mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6">
                    <div className="flex items-center justify-between">
                      <div><h3 className="text-sm font-bold">Bloquear adicionar bots</h3><p className="mt-1 text-sm text-muted-foreground">Impedir que membros adicionem outros bots no servidor</p></div>
                      <Switch checked={current.blockBots} onCheckedChange={(v) => update("blockBots", v)} disabled={!sp} />
                    </div>
                  </div>
                </>
              )}
              {serverProtectionTab === "bans-kicks" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure a proteção contra banimentos e expulsões</p></div>
                  <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">Usar limite global</h3><p className="mt-1 text-sm text-muted-foreground">Aplicar o mesmo limite para todas as ações deste grupo</p></div><Switch checked={current.bkGlobalLimit} onCheckedChange={(v) => update("bkGlobalLimit", v)} disabled={!sp} /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Limite de ação</label><Input value={current.bkActionLimit} onChange={(e) => update("bkActionLimit", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempo (minutos)</label><Input value={current.bkTime} onChange={(e) => update("bkTime", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal de logs</label><Select value={current.bkLogChannel} onValueChange={(v) => update("bkLogChannel", v)} disabled={!sp}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="disabled">Desativado</SelectItem><SelectItem value="general">general</SelectItem><SelectItem value="logs">logs</SelectItem></SelectContent></Select></div>
                  </div>
                  <Select value={current.bkPunishment} onValueChange={(v) => update("bkPunishment", v)} disabled={!sp}><SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remove-roles">Remover todos os cargos</SelectItem><SelectItem value="kick">Expulsar do servidor</SelectItem><SelectItem value="ban">Banir do servidor</SelectItem></SelectContent></Select>
                  <div className="border-t border-border/50 pt-6 flex items-center justify-between"><div><h3 className="text-sm font-bold">Reverter ações ao punir</h3></div><Switch checked={current.bkRevertActions} onCheckedChange={(v) => update("bkRevertActions", v)} disabled={!sp} /></div>
                  <div className="border-t border-border/50 pt-6 flex items-center justify-between"><div><h3 className="text-sm font-bold">Bloquear banimentos manuais</h3></div><Switch checked={current.bkBlockBans} onCheckedChange={(v) => update("bkBlockBans", v)} disabled={!sp} /></div>
                  <div className="border-t border-border/50 pt-6 flex items-center justify-between"><div><h3 className="text-sm font-bold">Bloquear expulsões manuais</h3></div><Switch checked={current.bkBlockKicks} onCheckedChange={(v) => update("bkBlockKicks", v)} disabled={!sp} /></div>
                </div>
              )}
              {serverProtectionTab === "castigos" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure a proteção contra castigos</p></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Limite de ação</label><Input value={current.castActionLimit} onChange={(e) => update("castActionLimit", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempo (minutos)</label><Input value={current.castTime} onChange={(e) => update("castTime", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal de logs</label><Select value={current.castLogChannel} onValueChange={(v) => update("castLogChannel", v)} disabled={!sp}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="disabled">Desativado</SelectItem><SelectItem value="general">general</SelectItem><SelectItem value="logs">logs</SelectItem></SelectContent></Select></div>
                  </div>
                  <Select value={current.castPunishment} onValueChange={(v) => update("castPunishment", v)} disabled={!sp}><SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remove-roles">Remover todos os cargos</SelectItem><SelectItem value="kick">Expulsar do servidor</SelectItem><SelectItem value="ban">Banir do servidor</SelectItem></SelectContent></Select>
                  <div className="border-t border-border/50 pt-6 flex items-center justify-between"><div><h3 className="text-sm font-bold">Reverter ações ao punir</h3></div><Switch checked={current.castRevertActions} onCheckedChange={(v) => update("castRevertActions", v)} disabled={!sp} /></div>
                  <div className="border-t border-border/50 pt-6 flex items-center justify-between"><div><h3 className="text-sm font-bold">Bloquear castigos manuais</h3></div><Switch checked={current.castBlockManual} onCheckedChange={(v) => update("castBlockManual", v)} disabled={!sp} /></div>
                </div>
              )}
              {serverProtectionTab === "canais" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure a proteção de canais</p></div>
                  <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">Usar limite global</h3></div><Switch checked={current.chGlobalLimit} onCheckedChange={(v) => update("chGlobalLimit", v)} disabled={!sp} /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Limite de ação</label><Input value={current.chActionLimit} onChange={(e) => update("chActionLimit", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempo (minutos)</label><Input value={current.chTime} onChange={(e) => update("chTime", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal de logs</label><Select value={current.chLogChannel} onValueChange={(v) => update("chLogChannel", v)} disabled={!sp}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="disabled">Desativado</SelectItem><SelectItem value="general">general</SelectItem><SelectItem value="logs">logs</SelectItem></SelectContent></Select></div>
                  </div>
                  <Select value={current.chPunishment} onValueChange={(v) => update("chPunishment", v)} disabled={!sp}><SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remove-roles">Remover todos os cargos</SelectItem><SelectItem value="kick">Expulsar do servidor</SelectItem><SelectItem value="ban">Banir do servidor</SelectItem></SelectContent></Select>
                  <div className="border-t border-border/50 pt-6 flex items-center justify-between"><div><h3 className="text-sm font-bold">Reverter ações ao punir</h3></div><Switch checked={current.chRevertActions} onCheckedChange={(v) => update("chRevertActions", v)} disabled={!sp} /></div>
                </div>
              )}
              {serverProtectionTab === "cargos" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure a proteção de cargos</p></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold">Usar limite global</h3>
                      <p className="text-xs text-muted-foreground">Aplicar o mesmo limite para todas as ações deste grupo</p>
                    </div>
                    <Switch checked={current.roleGlobalLimit} onCheckedChange={(v) => update("roleGlobalLimit", v)} disabled={!sp} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Limite de ação</label><Input value={current.roleActionLimit} onChange={(e) => update("roleActionLimit", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Tempo (minutos)</label><Input value={current.roleTime} onChange={(e) => update("roleTime", e.target.value)} className="bg-background border-border" disabled={!sp} /></div>
                    <div><label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal de logs</label><Select value={current.roleLogChannel} onValueChange={(v) => update("roleLogChannel", v)} disabled={!sp}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="disabled">Desativado</SelectItem><SelectItem value="general">general</SelectItem><SelectItem value="logs">logs</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Punição a ser aplicada</p></div>
                  <Select value={current.rolePunishment} onValueChange={(v) => update("rolePunishment", v)} disabled={!sp}><SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remove-roles">Remover todos os cargos</SelectItem><SelectItem value="kick">Expulsar do servidor</SelectItem><SelectItem value="ban">Banir do servidor</SelectItem></SelectContent></Select>
                  <div className="border-t border-border/50 pt-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold">Reverter ações ao punir</h3>
                      <p className="text-xs text-muted-foreground">Desfaz automaticamente todas as ações realizadas pelo usuário punido (ex: recria canais deletados, reverte edições, desbane membros)</p>
                    </div>
                    <Switch checked={current.roleRevertActions} onCheckedChange={(v) => update("roleRevertActions", v)} disabled={!sp} />
                  </div>
                  <div className="border-t border-border/50 pt-6">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Cargos bloqueados (Os cargos listados abaixo serão bloqueados de adicionar manualmente, mas ainda será possível através de comando)</p></div>
                    <div className="mt-4">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Cargos: {current.roleBlockedRole ? 1 : 0}</label>
                      <Select value={current.roleBlockedRole} onValueChange={(v) => update("roleBlockedRole", v)} disabled={!sp}><SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um cargo" /></SelectTrigger><SelectContent>{mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent></Select>
                    </div>
                  </div>
                  <div className="border-t border-border/50 pt-6">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Permissões liberadas (Permite que estas permissões sejam adicionadas em cargos, ou que membros recebam cargos que tenham alguma dessas permissões)</p></div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        { key: "admin", label: "Administrador", desc: "Permitir permissão de Administrador" },
                        { key: "ban", label: "Banir", desc: "Permitir permissão de Banir" },
                        { key: "kick", label: "Expulsar", desc: "Permitir permissão de Expulsar" },
                        { key: "manageRoles", label: "Gerenciar Cargos", desc: "Permitir permissão de Gerenciar Cargos" },
                        { key: "manageChannels", label: "Gerenciar Canais", desc: "Permitir permissão de Gerenciar Canais" },
                        { key: "manageServer", label: "Gerenciar Servidor", desc: "Permitir permissão de Gerenciar Servidor" },
                      ].map((perm) => (
                        <div key={perm.key} className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4">
                          <div><h4 className="text-sm font-bold">{perm.label}</h4><p className="text-xs text-muted-foreground">{perm.desc}</p></div>
                          <Switch checked={current.rolePermissions[perm.key]} onCheckedChange={(v) => update("rolePermissions", { ...current.rolePermissions, [perm.key]: v })} disabled={!sp} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {serverProtectionTab === "cargos-gerenciados" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3"><h2 className="font-display text-xl font-bold">Cargos Gerenciados</h2><span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">BETA</span></div>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">WHITELIST DE CARGOS (será ignorado pela proteção)</p></div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Cargos: 0</label>
                      <Select value={current.mgWhitelistRole} onValueChange={(v) => update("mgWhitelistRole", v)} disabled={!sp}><SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione cargos" /></SelectTrigger><SelectContent>{mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="border-t border-border/50 pt-6">
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-medium">Punição a ser aplicada</p></div>
                          <Select value={current.mgPunishment} onValueChange={(v) => update("mgPunishment", v)} disabled={!sp}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="revert">Apenas Reverter ação</SelectItem><SelectItem value="remove-roles">Remover todos os cargos</SelectItem><SelectItem value="kick">Expulsar</SelectItem><SelectItem value="ban">Banir</SelectItem></SelectContent></Select>
                        </div>
                        <div className="flex-1">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal de logs</label>
                          <Select value={current.mgLogChannel} onValueChange={(v) => update("mgLogChannel", v)} disabled={!sp}><SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="disabled">Desativado</SelectItem><SelectItem value="general">general</SelectItem><SelectItem value="logs">logs</SelectItem></SelectContent></Select>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Cargos Gerenciados (0)</p></div>
                        <div className="relative" ref={mgAddCargoRef}>
                          <Button variant="outline" size="sm" className="gap-2 border-border" disabled={!sp} onClick={() => { setMgAddCargoOpen(!mgAddCargoOpen); setMgCargoSearch(""); }}><Plus className="h-4 w-4" /> Adicionar Cargo</Button>
                          {mgAddCargoOpen && (
                            <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border border-border bg-card shadow-xl">
                              <div className="p-2">
                                <div className="relative">
                                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                  <Input placeholder="Pesquisar" value={mgCargoSearch} onChange={(e) => setMgCargoSearch(e.target.value)} className="h-8 bg-background border-border pl-8 text-sm" autoFocus />
                                </div>
                              </div>
                              <div className="max-h-48 overflow-y-auto py-1">
                                {mockRoles.filter((r) => r.name.toLowerCase().includes(mgCargoSearch.toLowerCase())).map((role) => (
                                  <button key={role.id} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors" onClick={() => { setMgAddCargoOpen(false); }}>
                                    @{role.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg border border-dashed border-border/50 p-8 text-center"><p className="text-sm text-muted-foreground">Nenhum cargo gerenciado configurado.</p></div>
                    </div>
                  </div>
                </div>
              )}
              {serverProtectionTab === "comandos" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Lista de comandos</p></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Pesquisar..." value={cmdSearch} onChange={(e) => setCmdSearch(e.target.value)} className="bg-background border-border pl-10" disabled={!sp} />
                  </div>
                  {[
                    { name: "/addrole", desc: "Use para adicionar cargo a um membro.", key: "cmdAddrole" as const },
                    { name: "/removerole", desc: "Use para remover cargo de um membro.", key: "cmdRemoverole" as const },
                  ].filter((cmd) => cmd.name.includes(cmdSearch.toLowerCase())).map((cmd) => (
                    <div key={cmd.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4">
                      <div><h4 className="text-sm font-bold">{cmd.name}</h4><p className="text-xs text-muted-foreground">{cmd.desc}</p></div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="border-border" disabled={!sp}>Editar</Button>
                        <Switch checked={current[cmd.key]} onCheckedChange={(v) => update(cmd.key, v)} disabled={!sp} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  const moderationTabs = ["Automod", "Moderação", "Audit Logs", "Restrições", "Comandos"];

  const modCommandsList = [
    { key: "ban", name: "/ban", desc: "Bane um membro." },
    { key: "unban", name: "/unban", desc: "Desbane um membro." },
    { key: "kick", name: "/kick", desc: "Expulse um membro no servidor." },
    { key: "mute", name: "/mute", desc: "Mute um membro no servidor." },
    { key: "unmute", name: "/unmute", desc: "Desmute um membro no servidor." },
    { key: "mutecall", name: "/mutecall", desc: "Mute um membro em canais de voz." },
    { key: "unmutecall", name: "/unmutecall", desc: "Desmute um membro em canais de voz." },
    { key: "lock", name: "/lock", desc: "Impeça que os usuários falem no canal." },
    { key: "unlock", name: "/unlock", desc: "Permita que os usuários falem no canal." },
    { key: "unbanall", name: "/unbanall", desc: "Desbanir todos os membros. (Exceto blacklist)" },
    { key: "blacklist", name: "/blacklist", desc: "Utilize para vincular um instagram ao seu perfil." },
    { key: "advertence", name: "/advertence", desc: "Advertir um membro." },
    { key: "removeadvertence", name: "/removeadvertence", desc: "Remover advertência de um membro." },
    { key: "castigar", name: "/castigar", desc: "Castigar um membro." },
    { key: "removecastigo", name: "/removecastigo", desc: "Remover o castigo de um membro." },
    { key: "nuke", name: "/nuke", desc: "Recrie um chat." },
  ];

  const me = current.moderationEnabled;

  const renderModerationContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">Moderação</h1>
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
          </div>
          <p className="mt-1 text-muted-foreground">Mantenha seu servidor seguro com moderação automática</p>
        </div>
        <Switch checked={me} onCheckedChange={(v) => update("moderationEnabled", v)} />
      </div>
      <div className="relative mt-8">
        <AnimatePresence>
          {!me && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
              <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Gavel className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display text-lg font-bold">Moderação</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mantenha seu servidor seguro com moderação automática</p>
                <Button onClick={() => update("moderationEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-border/50 overflow-x-auto">
            {moderationTabs.map((tab) => {
              const tabId = tab.toLowerCase().replace(/ /g, "-");
              return (
                <button key={tab} onClick={() => { if (me) { setModerationTab(tabId); setModDetailOpen(null); } }} className={`whitespace-nowrap pb-3 text-sm font-semibold transition-colors ${moderationTab === tabId ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"} ${!me ? "pointer-events-none" : ""}`}>{tab}</button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={`${moderationTab}-${modDetailOpen || 'list'}`} initial={{ opacity: 0, x: modDetailOpen ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: modDetailOpen ? -20 : 20 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6">
              {moderationTab === "automod" && !modDetailOpen && (
                <>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">O Automod é uma ação de moderação automática.</p></div>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { key: "modAutoSpam" as const, label: "ANTI-SPAM" },
                        { key: "modBlockedWords" as const, label: "PALAVRAS BLOQUEADAS" },
                        { key: "modDuplicateText" as const, label: "TEXTO DUPLICADO" },
                        { key: "modAntiInvites" as const, label: "ANTI INVITES" },
                        { key: "modAntiLinks" as const, label: "ANTI LINKS" },
                        { key: "modExcessCaps" as const, label: "CAPS EM EXCESSO" },
                        { key: "modExcessEmojis" as const, label: "EMOJIS EM EXCESSO" },
                        { key: "modExcessMentions" as const, label: "MENÇÕES EM EXCESSO" },
                        { key: "modZalgo" as const, label: "ZALGO" },
                      ].map((item) => (
                        <div key={item.key}>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</label>
                            <button onClick={() => me && setModDetailOpen(item.key)} className="text-muted-foreground hover:text-foreground transition-colors disabled:pointer-events-none" disabled={!me}>
                              <Sliders className="h-4 w-4" />
                            </button>
                          </div>
                          <Select value={current[item.key]} onValueChange={(v) => update(item.key, v)} disabled={!me}>
                            <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="disabled">Desativado</SelectItem>
                              <SelectItem value="delete">Deletar mensagem</SelectItem>
                              <SelectItem value="alert">Alertar membro</SelectItem>
                              <SelectItem value="delete-alert">Deletar mensagem &amp; Alertar membro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-bold">Cargos de imunidade</h2>
                    <div className="rounded-lg border border-border/50 bg-card p-6">
                      <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Membros com algum desses cargos não serão afetados pelo Automod.</p></div>
                      <div className="mt-4">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">CARGOS: 0</label>
                        <Select value={current.modImmunityRoles} onValueChange={(v) => update("modImmunityRoles", v)} disabled={!me}>
                          <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um cargo" /></SelectTrigger>
                          <SelectContent>{mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {moderationTab === "automod" && modDetailOpen && (() => {
                const detailLabels: Record<string, string> = {
                  modAutoSpam: "Anti-spam",
                  modBlockedWords: "Palavras bloqueadas",
                  modDuplicateText: "Texto duplicado",
                  modAntiInvites: "Anti invites",
                  modAntiLinks: "Anti links",
                  modExcessCaps: "Caps em excesso (70% > CAPS)",
                  modExcessEmojis: "Emojis em excesso",
                  modExcessMentions: "Menções em excesso",
                  modZalgo: "Zalgo",
                };
                const title = detailLabels[modDetailOpen] || modDetailOpen;
                return (
                  <div className="space-y-6">
                    <button onClick={() => setModDetailOpen(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="font-bold text-foreground text-lg">{title}</span>
                    </button>
                    <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                      <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Permissões</p></div>
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">CANAIS DESABILITADOS: 0</label>
                        <Select value={current.modSpamDisabledChannel} onValueChange={(v) => update("modSpamDisabledChannel", v)}>
                          <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um canal" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">general</SelectItem>
                            <SelectItem value="commands">commands</SelectItem>
                            <SelectItem value="bot">bot</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">CARGOS DESABILITADOS: 0</label>
                        <Select value={current.modSpamDisabledRole} onValueChange={(v) => update("modSpamDisabledRole", v)}>
                          <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um cargo" /></SelectTrigger>
                          <SelectContent>
                            {mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {modDetailOpen === "modAutoSpam" && (
                      <>
                        <h2 className="font-display text-xl font-bold">Informações adicionais</h2>
                        <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                          <div>
                            <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Limite de Mensagem</p></div>
                            <div className="flex justify-between text-xs text-primary mb-1"><span>1</span><span>100</span></div>
                            <Slider value={[current.modSpamLimit]} onValueChange={(v) => update("modSpamLimit", v[0])} min={1} max={100} step={1} className="max-w-md" />
                          </div>
                          <div>
                            <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Por segundos</p></div>
                            <div className="flex justify-between text-xs text-primary mb-1"><span>1</span><span>600</span></div>
                            <Slider value={[current.modSpamSeconds]} onValueChange={(v) => update("modSpamSeconds", v[0])} min={1} max={600} step={1} className="max-w-md" />
                          </div>
                        </div>
                      </>
                    )}
                    {modDetailOpen === "modBlockedWords" && (
                      <>
                        <h2 className="font-display text-xl font-bold">Informações adicionais</h2>
                        <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                          <div>
                            <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Palavras bloqueadas (Palavra exata)</p></div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {current.modBlockedExact.map((w, i) => (
                                <span key={i} className="flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-medium">
                                  {w}
                                  <button onClick={() => update("modBlockedExact", current.modBlockedExact.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                                </span>
                              ))}
                            </div>
                            <Input placeholder="Escreva uma palavra..." value={modBlockedExactInput} onChange={(e) => setModBlockedExactInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && modBlockedExactInput.trim()) { update("modBlockedExact", [...current.modBlockedExact, modBlockedExactInput.trim()]); setModBlockedExactInput(""); } }} className="bg-background border-border max-w-md" />
                          </div>
                          <div>
                            <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Palavras bloqueadas (Alguma parte da palavra)</p></div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {current.modBlockedPartial.map((w, i) => (
                                <span key={i} className="flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-medium">
                                  {w}
                                  <button onClick={() => update("modBlockedPartial", current.modBlockedPartial.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                                </span>
                              ))}
                            </div>
                            <Input placeholder="Escreva uma palavra..." value={modBlockedPartialInput} onChange={(e) => setModBlockedPartialInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && modBlockedPartialInput.trim()) { update("modBlockedPartial", [...current.modBlockedPartial, modBlockedPartialInput.trim()]); setModBlockedPartialInput(""); } }} className="bg-background border-border max-w-md" />
                          </div>
                        </div>
                      </>
                    )}
                    {modDetailOpen === "modAntiLinks" && (
                      <>
                        <h2 className="font-display text-xl font-bold">Informações adicionais</h2>
                        <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                          <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Links permitidos</p></div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {current.modAllowedLinks.map((link, i) => (
                              <span key={i} className="flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-medium">
                                {link}
                                <button onClick={() => update("modAllowedLinks", current.modAllowedLinks.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                              </span>
                            ))}
                          </div>
                          <Input placeholder="Escreva um link..." value={modLinkInput} onChange={(e) => setModLinkInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && modLinkInput.trim()) { update("modAllowedLinks", [...current.modAllowedLinks, modLinkInput.trim()]); setModLinkInput(""); } }} className="bg-background border-border max-w-md" />
                        </div>
                      </>
                    )}
                    {modDetailOpen === "modExcessEmojis" && (
                      <>
                        <h2 className="font-display text-xl font-bold">Informações adicionais</h2>
                        <div className="rounded-lg border border-border/50 bg-card p-6">
                          <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Limite de emojis por mensagem</p></div>
                          <div className="relative max-w-md">
                            <span className="text-xs font-bold text-primary">{current.modEmojiLimit}</span>
                            <Slider value={[current.modEmojiLimit]} onValueChange={(v) => update("modEmojiLimit", v[0])} min={1} max={100} step={1} className="mt-1" />
                          </div>
                        </div>
                      </>
                    )}
                    {modDetailOpen === "modExcessMentions" && (
                      <>
                        <h2 className="font-display text-xl font-bold">Informações adicionais</h2>
                        <div className="rounded-lg border border-border/50 bg-card p-6">
                          <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Limite de menções por mensagem</p></div>
                          <div className="relative max-w-md">
                            <span className="text-xs font-bold text-primary">{current.modMentionLimit}</span>
                            <Slider value={[current.modMentionLimit]} onValueChange={(v) => update("modMentionLimit", v[0])} min={1} max={100} step={1} className="mt-1" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
              {moderationTab === "moderação" && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Cargo de membro mutado</p></div>
                    <Select value={current.modMutedRole} onValueChange={(v) => update("modMutedRole", v)} disabled={!me}>
                      <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Criar um novo cargo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Criar um novo cargo</SelectItem>
                        {mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                    <div className="border-l-2 border-primary pl-4 flex items-center gap-2">
                      <p className="text-sm font-bold">Configurações de advertências</p>
                      <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">BETA</span>
                    </div>
                    {warnings.map((w) => (
                      <div key={w.id} className="rounded-lg border border-border/50 bg-background">
                        <button
                          onClick={() => setOpenWarningId(openWarningId === w.id ? null : w.id)}
                          className="flex w-full items-center justify-between p-4 text-left"
                        >
                          <span className="text-sm font-semibold">Advertência {w.id}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${openWarningId === w.id ? "rotate-180" : ""}`} />
                        </button>
                        {openWarningId === w.id && (
                          <div className="border-t border-border/50 p-4 space-y-4">
                            <div className="flex items-end gap-4">
                              <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">CARGO</label>
                                <Select value={w.cargo} onValueChange={(v) => setWarnings(warnings.map(ww => ww.id === w.id ? { ...ww, cargo: v } : ww))}>
                                  <SelectTrigger className="w-48 bg-background border-border"><SelectValue placeholder="Criar um novo cargo" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Criar um novo cargo</SelectItem>
                                    {mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">TEMPO (EM HORAS)</label>
                                <Input value={w.tempo} onChange={(e) => setWarnings(warnings.map(ww => ww.id === w.id ? { ...ww, tempo: e.target.value } : ww))} className="w-32 bg-background border-border" />
                              </div>
                              <Button variant="outline" className="border-border" onClick={() => { setWarnings(warnings.filter(ww => ww.id !== w.id)); setOpenWarningId(null); }}>Deletar</Button>
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">PUNIÇÃO</label>
                              <Select value={w.punicao} onValueChange={(v) => setWarnings(warnings.map(ww => ww.id === w.id ? { ...ww, punicao: v } : ww))}>
                                <SelectTrigger className="w-48 bg-background border-border"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Não fazer nada</SelectItem>
                                  <SelectItem value="mute">Mutar</SelectItem>
                                  <SelectItem value="kick">Expulsar</SelectItem>
                                  <SelectItem value="ban">Banir</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={() => {
                        const newId = warnings.length > 0 ? Math.max(...warnings.map(w => w.id)) + 1 : 1;
                        setWarnings([...warnings, { id: newId, cargo: "new", tempo: "1", punicao: "none" }]);
                      }}
                    >
                      Criar advertência
                    </Button>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card p-6 space-y-2">
                    <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Configurações de punições</p></div>
                    <div className="rounded-lg border border-border/50 bg-card divide-y divide-border/50">
                      {[
                        { key: "modNotifyBans" as const, label: "Notificar banimentos", desc: "Notificar membro via DM ao ser banido" },
                        { key: "modNotifyKicks" as const, label: "Notificar expulsões", desc: "Notificar membro via DM ao ser expulso" },
                        { key: "modNotifyWarns" as const, label: "Notificar advertências", desc: "Notificar membro via DM ao ser advertido" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-6">
                          <div><h3 className="text-sm font-bold">{item.label}</h3><p className="mt-1 text-sm text-muted-foreground">{item.desc}</p></div>
                          <Switch checked={current[item.key]} onCheckedChange={(v) => update(item.key, v)} disabled={!me} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {moderationTab === "audit-logs" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Logs de moderação</p></div>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { key: "modLogBans" as const, label: "LOGS DE BANIMENTOS" },
                      { key: "modLogMutes" as const, label: "LOGS DE MUTES" },
                      { key: "modLogKicks" as const, label: "LOGS DE EXPULSÕES" },
                      { key: "modLogWarns" as const, label: "LOGS DE ADVERTÊNCIAS" },
                      { key: "modLogPunishments" as const, label: "LOGS DE CASTIGOS" },
                    ].map((item) => (
                      <div key={item.key}>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</label>
                        <Select value={current[item.key]} onValueChange={(v) => update(item.key, v)} disabled={!me}>
                          <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disabled">Desativado</SelectItem>
                            <SelectItem value="general">general</SelectItem>
                            <SelectItem value="logs">logs</SelectItem>
                            <SelectItem value="mod-logs">mod-logs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {moderationTab === "restrições" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Comando de Restrições</p></div>
                  <p className="text-sm text-muted-foreground">Configure quem pode usar o comando /restricao no Discord.</p>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">CARGOS PERMITIDOS: 0</label>
                    <Select value={current.modRestrictionRoles} onValueChange={(v) => update("modRestrictionRoles", v)} disabled={!me}>
                      <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione cargos" /></SelectTrigger>
                      <SelectContent>{mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">0/150 cargos selecionado</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">USUÁRIOS PERMITIDOS (Máx. 150)</label>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Nome de usuário ou ID" value={current.modRestrictionUsers} onChange={(e) => update("modRestrictionUsers", e.target.value)} className="bg-background border-border max-w-xs" disabled={!me} />
                      <Button size="icon" variant="outline" className="shrink-0 border-border" disabled={!me}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">CANAL DE LOGS</label>
                    <Select value={current.modRestrictionLogChannel} onValueChange={(v) => update("modRestrictionLogChannel", v)} disabled={!me}>
                      <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Desativado</SelectItem>
                        <SelectItem value="general">general</SelectItem>
                        <SelectItem value="logs">logs</SelectItem>
                        <SelectItem value="mod-logs">mod-logs</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">Canal onde serão enviados os logs de restrições aplicadas.</p>
                  </div>
                </div>
              )}
              {moderationTab === "comandos" && (
                <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                  <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Lista de comandos</p></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Pesquisar..." value={modCmdSearch} onChange={(e) => setModCmdSearch(e.target.value)} className="bg-background border-border pl-10" disabled={!me} />
                  </div>
                  {modCommandsList.filter((cmd) => cmd.name.includes(modCmdSearch.toLowerCase())).map((cmd) => (
                    <div key={cmd.key} className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4">
                      <div><h4 className="text-sm font-bold">{cmd.name}</h4><p className="text-xs text-muted-foreground">{cmd.desc}</p></div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="border-border" disabled={!me}>Editar</Button>
                        <Switch checked={current.modCommands[cmd.key] ?? true} onCheckedChange={(v) => update("modCommands", { ...current.modCommands, [cmd.key]: v })} disabled={!me} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  const el = current.eventLogsEnabled;

  const channelOptions = (
    <>
      <SelectItem value="disabled">Desativado</SelectItem>
      <SelectItem value="general">general</SelectItem>
      <SelectItem value="logs">logs</SelectItem>
      <SelectItem value="mod-logs">mod-logs</SelectItem>
    </>
  );

  const renderEventLogsContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">Logs de Eventos</h1>
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
          </div>
          <p className="mt-1 text-muted-foreground">Mantenha seu servidor seguro com logs.</p>
        </div>
        <Switch checked={el} onCheckedChange={(v) => update("eventLogsEnabled", v)} />
      </div>
      <div className="relative mt-8">
        <AnimatePresence>
          {!el && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
              <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><ScrollText className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display text-lg font-bold">Logs De Eventos</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mantenha seu servidor seguro com logs.</p>
                <Button onClick={() => update("eventLogsEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-8">
          <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Eventos Gerais</p></div>
            <div className="grid grid-cols-2 gap-6">
              {([
                { key: "evFinanceiro" as const, label: "FINANCEIRO" },
                { key: "evEntradaBot" as const, label: "ENTRADA DE BOT" },
              ] as const).map((item) => (
                <div key={item.key}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</label>
                  <Select value={current[item.key]} onValueChange={(v) => update(item.key, v)} disabled={!el}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Eventos de Mensagem</p></div>
            <div className="grid grid-cols-2 gap-6">
              {([
                { key: "evMsgEditada" as const, label: "MENSAGEM EDITADA" },
                { key: "evMsgDeletada" as const, label: "MENSAGEM DELETADA" },
              ] as const).map((item) => (
                <div key={item.key}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</label>
                  <Select value={current[item.key]} onValueChange={(v) => update(item.key, v)} disabled={!el}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Eventos de Membro</p></div>
            <div className="grid grid-cols-3 gap-6">
              {([
                { key: "evComandos" as const, label: "COMANDOS" },
                { key: "evCanaisVoz" as const, label: "CANAIS DE VOZ" },
                { key: "evEntradaMembro" as const, label: "ENTRADA DE MEMBRO" },
                { key: "evSaidaMembro" as const, label: "SAÍDA DE MEMBRO" },
                { key: "evCargoAdicionado" as const, label: "CARGO ADICIONADO" },
                { key: "evCargoRemovido" as const, label: "CARGO REMOVIDO" },
              ] as const).map((item) => (
                <div key={item.key}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</label>
                  <Select value={current[item.key]} onValueChange={(v) => update(item.key, v)} disabled={!el}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Eventos de Cargo</p></div>
            <div className="grid grid-cols-3 gap-6">
              {([
                { key: "evCargoCriado" as const, label: "CARGO CRIADO" },
                { key: "evCargoAtualizado" as const, label: "CARGO ATUALIZADO" },
                { key: "evCargoDeletado" as const, label: "CARGO DELETADO" },
              ] as const).map((item) => (
                <div key={item.key}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</label>
                  <Select value={current[item.key]} onValueChange={(v) => update(item.key, v)} disabled={!el}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
            <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Eventos de Canais</p></div>
            <div className="grid grid-cols-3 gap-6">
              {([
                { key: "evCanalCriado" as const, label: "CANAL CRIADO" },
                { key: "evCanalAtualizado" as const, label: "CANAL ATUALIZADO" },
                { key: "evCanalDeletado" as const, label: "CANAL DELETADO" },
              ] as const).map((item) => (
                <div key={item.key}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</label>
                  <Select value={current[item.key]} onValueChange={(v) => update(item.key, v)} disabled={!el}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCountersContent = () => {
    const ct = current.countersEnabled;
    const counterChannelOptions = (
      <>
        <SelectItem value="disabled">Desativado</SelectItem>
        <SelectItem value="general">general</SelectItem>
        <SelectItem value="counters">counters</SelectItem>
        <SelectItem value="stats">stats</SelectItem>
      </>
    );
    return (
      <>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold">Contadores</h1>
              <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
            </div>
            <p className="mt-1 text-muted-foreground">Configure contadores de membros em call ou da quantidade de membros.</p>
          </div>
          <Switch checked={ct} onCheckedChange={(v) => update("countersEnabled", v)} />
        </div>
        <div className="relative mt-8 space-y-8">
          <AnimatePresence>
            {!ct && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-start justify-center rounded-xl backdrop-blur-sm bg-background/30 pt-20">
                <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-2xl max-w-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Hash className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold">Contadores</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Configure contadores de membros.</p>
                  <Button className="mt-4 w-full" onClick={() => update("countersEnabled", true)}>Ativar plugin</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Contador de membros</h2>
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure um canal para contar o total de membros</p></div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal</label>
                <Select value={current.cntMembrosCanal} onValueChange={(v) => update("cntMembrosCanal", v)} disabled={!ct}>
                  <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{counterChannelOptions}</SelectContent>
                </Select>
              </div>
              <div>
                <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Mensagem</p></div>
                <textarea
                  value={current.cntMembrosMsg}
                  onChange={(e) => update("cntMembrosMsg", e.target.value)}
                  disabled={!ct}
                  placeholder="Digite um tópico para o canal..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y"
                />
                <div className="mt-3">
                  <p className="text-sm font-semibold">Variáveis de texto:</p>
                  <p className="text-sm text-muted-foreground"><span className="text-primary font-mono">{"{counter}"}</span> - Será substituído pela quantidade de membros</p>
                </div>
              </div>
              <div>
                <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Emojis</p></div>
                <div className="grid grid-cols-5 gap-4">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i}>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Número {i}</label>
                      <button disabled={!ct} className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Contador de membros em call</h2>
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure um canal para contar membros em call</p></div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal</label>
                <Select value={current.cntCallCanal} onValueChange={(v) => update("cntCallCanal", v)} disabled={!ct}>
                  <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{counterChannelOptions}</SelectContent>
                </Select>
              </div>
              <div>
                <div className="border-l-2 border-primary pl-4 mb-4"><p className="text-sm font-bold">Mensagem</p></div>
                <Input
                  value={current.cntCallMsg}
                  onChange={(e) => update("cntCallMsg", e.target.value)}
                  disabled={!ct}
                  className="bg-background border-border max-w-md"
                />
                <div className="mt-3">
                  <p className="text-sm font-semibold">Variáveis de texto:</p>
                  <p className="text-sm text-muted-foreground"><span className="text-primary font-mono">%</span> - Será substituído pela quantidade de membros em call</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const bc = current.bioCheckerEnabled;

  const renderBioCheckerContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">Bio Checker</h1>
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
          </div>
          <p className="mt-1 text-muted-foreground">Verifique automaticamente os usuários que possuem algo na bio, status ou pronome.</p>
        </div>
        <Switch checked={bc} onCheckedChange={(v) => update("bioCheckerEnabled", v)} />
      </div>
      <div className="relative mt-8 min-h-[400px]">
        <AnimatePresence>
          {!bc && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-start justify-center pt-32 rounded-lg bg-background/60 backdrop-blur-sm">
              <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><FlaskConical className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display text-lg font-bold">Bio Checker</h3>
                <p className="mt-2 text-sm text-muted-foreground">Verifique automaticamente os usuários que possuem algo na bio, status ou pronome.</p>
                <Button onClick={() => update("bioCheckerEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Configurações</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium">Tokens (Veja nosso tutorial <span className="text-primary underline cursor-pointer">aqui</span>)</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Input value={current.bioTokens} onChange={(e) => update("bioTokens", e.target.value)} className="bg-background border-border" disabled={!bc} placeholder="" />
                  <Button variant="outline" className="border-border shrink-0" disabled={!bc}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Adicionar Token
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure um canal de logs</p></div>
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal de logs</label>
                  <Select value={current.bioLogChannel} onValueChange={(v) => update("bioLogChannel", v)} disabled={!bc}>
                    <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Bio Checker de Cargos</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure os cargos a serem checados</p></div>
                <div className="mt-4">
                  <button disabled={!bc} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                    <Plus className="h-4 w-4" />
                  </button>
                  {current.bioRoles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {current.bioRoles.map((role) => (
                        <span key={role.id} className="flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-medium">
                          {role.name}
                          <button onClick={() => update("bioRoles", current.bioRoles.filter(r => r.id !== role.id))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Texto a ser verificado no perfil dos usuários</p></div>
                <div className="mt-4">
                  <Input value={current.bioProfileText} onChange={(e) => update("bioProfileText", e.target.value)} className="bg-background border-border max-w-md" disabled={!bc} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Bio Checker</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Canal a ser postada a mensagem</p></div>
                <div className="mt-4 flex items-center gap-3">
                  <Select value={current.bioPostChannel} onValueChange={(v) => update("bioPostChannel", v)} disabled={!bc}>
                    <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                  <Button disabled={!bc || current.bioPostChannel === "disabled"} className="bg-green-600 hover:bg-green-700 text-primary-foreground shrink-0">Enviar mensagem</Button>
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-bold">Builder Mode</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Selecione qual builder mode será usado para criar a mensagem.</p>
                </div>
                <div className="mt-4 space-y-3">
                  <label className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${current.bioBuilderMode === "message-builder" ? "border-primary bg-primary/5" : "border-border bg-background"} ${!bc ? "pointer-events-none opacity-50" : ""}`}>
                    <input type="radio" name="bioBuilderMode" value="message-builder" checked={current.bioBuilderMode === "message-builder"} onChange={(e) => update("bioBuilderMode", e.target.value)} disabled={!bc} className="mt-1" />
                    <div>
                      <p className="text-sm font-bold">Message Builder</p>
                      <p className="text-xs text-muted-foreground">Use o construtor de mensagens antigo com content, embeds, botões e mais.</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${current.bioBuilderMode === "kally-engine" ? "border-primary bg-primary/5" : "border-border bg-background"} ${!bc ? "pointer-events-none opacity-50" : ""}`}>
                    <input type="radio" name="bioBuilderMode" value="kally-engine" checked={current.bioBuilderMode === "kally-engine"} onChange={(e) => update("bioBuilderMode", e.target.value)} disabled={!bc} className="mt-1" />
                    <div>
                      <p className="text-sm font-bold">Kally Engine</p>
                      <p className="text-xs text-muted-foreground">Use a nova engine para criar mensagens com mais recursos.</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Mensagem</p></div>
                <div className="mt-4">
                  <textarea
                    value={current.bioMessageText}
                    onChange={(e) => update("bioMessageText", e.target.value)}
                    disabled={!bc}
                    placeholder="Escreva a mensagem..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Mencionar @everyone</p>
                    <Switch checked={current.bioMentionEveryone} onCheckedChange={(v) => update("bioMentionEveryone", v)} disabled={!bc} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Mencionar @cargos</p>
                    <Switch checked={current.bioMentionRoles} onCheckedChange={(v) => update("bioMentionRoles", v)} disabled={!bc} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Mencionar @usuários</p>
                    <Switch checked={current.bioMentionUsers} onCheckedChange={(v) => update("bioMentionUsers", v)} disabled={!bc} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Verificação</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Texto de verificação</p></div>
                <div className="mt-4">
                  <Input value={current.bioVerifyText} onChange={(e) => update("bioVerifyText", e.target.value)} className="bg-background border-border max-w-md" disabled={!bc} />
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Cargos de verificação</p></div>
                <div className="mt-4">
                  <button disabled={!bc} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAutoroleContent = () => {
    const ar = current.autoroleEnabled;
    return (
      <>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold">Autorole</h1>
              <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
            </div>
            <p className="mt-1 text-muted-foreground">Autorole serve para você dar cargos para novos membros do seu servidor automaticamente quando eles entrarem no servidor</p>
          </div>
          <Switch checked={ar} onCheckedChange={(v) => update("autoroleEnabled", v)} />
        </div>
        <div className="relative mt-8">
          <AnimatePresence>
            {!ar && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-start justify-center pt-32 rounded-lg bg-background/60 backdrop-blur-sm">
                <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><UserCog className="h-6 w-6 text-primary" /></div>
                  <h3 className="font-display text-lg font-bold">Autorole</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Autorole serve para você dar cargos para novos membros do seu servidor automaticamente quando eles entrarem no servidor</p>
                  <Button onClick={() => update("autoroleEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-6">
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Configure cargos de entrada para novos membros</p></div>
              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Cargos: 0</label>
                <Select value={current.autoroleRole} onValueChange={(v) => update("autoroleRole", v)} disabled={!ar}>
                  <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um cargo" /></SelectTrigger>
                  <SelectContent>{mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">Cargo por Emblemas</p></div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {emblemsList.map((emblem) => (
                  <div key={emblem.key}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{emblem.icon}</span>
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{emblem.label}</label>
                    </div>
                    <Select value={current.autoroleEmblems[emblem.key]} onValueChange={(v) => update("autoroleEmblems", { ...current.autoroleEmblems, [emblem.key]: v })} disabled={!ar}>
                      <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Desativado</SelectItem>
                        {mockRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderWhitelistContent = () => {
    const wl = current.whitelistEnabled;

    const RoleAddButton = ({ roles, onAdd, disabled }: { roles: { id: string; name: string }[]; onAdd: (role: { id: string; name: string }) => void; disabled?: boolean }) => {
      const [open, setOpen] = useState(false);
      const available = mockRoles.filter((r) => !roles.some((ar) => ar.id === r.id));
      return (
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-2">
            {roles.map((r) => (
              <span key={r.id} className="inline-flex items-center gap-1 rounded bg-primary/20 px-2 py-1 text-xs text-primary">
                {r.name}
                <button onClick={() => onAdd(r)} className="ml-1 text-muted-foreground hover:text-foreground">×</button>
              </span>
            ))}
          </div>
          <button
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            className="flex h-8 w-8 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute z-50 mt-1 w-48 rounded-md border border-border bg-popover p-1 shadow-lg">
              {available.length === 0 ? (
                <p className="p-2 text-xs text-muted-foreground">Nenhum cargo disponível</p>
              ) : (
                available.map((r) => (
                  <button key={r.id} className="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-accent" onClick={() => { onAdd(r); setOpen(false); }}>
                    {r.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      );
    };

    const addRole = (field: "wlApproveRoles" | "wlWhitelistRoles" | "wlVerifiedRoles" | "wlCodeRoles", role: { id: string; name: string }) => {
      const exists = current[field].some((r) => r.id === role.id);
      if (exists) {
        update(field, current[field].filter((r) => r.id !== role.id));
      } else {
        update(field, [...current[field], role]);
      }
    };

    return (
      <>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold">Whitelist</h1>
              <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
            </div>
            <p className="mt-1 text-muted-foreground">Verifique seus novos membros de forma fácil e prática!</p>
          </div>
          <Switch checked={wl} onCheckedChange={(v) => update("whitelistEnabled", v)} />
        </div>
        <div className="relative mt-8 min-h-[400px]">
          <AnimatePresence>
            {!wl && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-start justify-center pt-32 rounded-lg bg-background/60 backdrop-blur-sm">
                <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><ListChecks className="h-6 w-6 text-primary" /></div>
                  <h3 className="font-display text-lg font-bold">Whitelist</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Verifique seus novos membros de forma fácil e prática!</p>
                  <Button onClick={() => update("whitelistEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-6">
            {/* Configure os canais da whitelist */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Configure os canais da whitelist</p></div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-xs text-muted-foreground">Canal de aprovação</label>
                  <Select value={current.wlApprovalChannel} onValueChange={(v) => update("wlApprovalChannel", v)} disabled={!wl}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-xs text-muted-foreground">Canal de logs</label>
                  <Select value={current.wlLogChannel} onValueChange={(v) => update("wlLogChannel", v)} disabled={!wl}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Cargos que poderão aprovar ou negar whitelist */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Cargos que poderão aprovar ou negar whitelist (Deixe vazio para permitir todos membros)</p></div>
              <RoleAddButton roles={current.wlApproveRoles} onAdd={(r) => addRole("wlApproveRoles", r)} disabled={!wl} />
            </div>

            {/* Cargos que poderão realizar a whitelist */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Cargos que poderão realizar a whitelist</p></div>
              <Select value={current.wlWhitelistRolesMode} onValueChange={(v) => update("wlWhitelistRolesMode", v)} disabled={!wl}>
                <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow-except">Permitir todos, exceto:</SelectItem>
                  <SelectItem value="deny-except">Negar todos, exceto:</SelectItem>
                </SelectContent>
              </Select>
              <RoleAddButton roles={current.wlWhitelistRoles} onAdd={(r) => addRole("wlWhitelistRoles", r)} disabled={!wl} />
            </div>

            {/* Configure os cargos de membro verificado */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Configure os cargos de membro verificado</p></div>
              <RoleAddButton roles={current.wlVerifiedRoles} onAdd={(r) => addRole("wlVerifiedRoles", r)} disabled={!wl} />
            </div>

            {/* Tipo de verificação */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4 flex items-center gap-2">
                <p className="text-sm font-bold">Tipo de verificação</p>
                <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">BETA</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => wl && update("wlVerificationType", "questions")}
                  disabled={!wl}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${current.wlVerificationType === "questions" ? "border-primary bg-primary/10" : "border-border/50 bg-card hover:border-border"}`}
                >
                  <h4 className="text-sm font-bold">Verificação por perguntas</h4>
                  <p className="text-xs text-muted-foreground mt-1">Os membros devem responder algumas perguntas para serem verificado.</p>
                </button>
                <button
                  onClick={() => wl && update("wlVerificationType", "user")}
                  disabled={!wl}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${current.wlVerificationType === "user" ? "border-primary bg-primary/10" : "border-border/50 bg-card hover:border-border"}`}
                >
                  <h4 className="text-sm font-bold">Verificação por usuário</h4>
                  <p className="text-xs text-muted-foreground mt-1">Os membros devem selecionar um usuário conhecido para ser verificado.</p>
                </button>
              </div>

              {/* Adicionar pergunta - only when questions mode */}
              <AnimatePresence>
                {current.wlVerificationType === "questions" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        if (!wl) return;
                        const newQ = { id: wlQuestionCounter, nome: "Nova pergunta", placeholder: "Placeholder", estilo: "linha-unica", tamanhoMin: 0, tamanhoMax: 0, obrigatoria: true };
                        setWlQuestions(prev => [...prev, newQ]);
                        setWlQuestionCounter(prev => prev + 1);
                      }}
                      disabled={!wl}
                      className="w-full rounded-lg border border-border/50 bg-card p-4 text-center text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground transition-colors"
                    >
                      Adicionar pergunta
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Configure as perguntas - only when questions mode and has questions */}
            <AnimatePresence>
              {current.wlVerificationType === "questions" && wlQuestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border border-border/50 bg-card p-6 space-y-4"
                >
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm font-bold">Configure as perguntas a serem feitas em sua whitelist</p>
                  </div>
                  <div className="space-y-2">
                    {wlQuestions.map((q) => (
                      <div key={q.id} className="rounded-lg border border-border/50 bg-background overflow-hidden">
                        <button
                          onClick={() => setOpenQuestionId(openQuestionId === q.id ? null : q.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                        >
                          <span className="text-sm font-bold">{q.nome}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openQuestionId === q.id ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {openQuestionId === q.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Nome <span className="text-red-500">*</span></label>
                                    <Input
                                      value={q.nome}
                                      onChange={(e) => setWlQuestions(prev => prev.map(p => p.id === q.id ? { ...p, nome: e.target.value } : p))}
                                      className="bg-background border-border"
                                    />
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Placeholder</label>
                                    <Input
                                      value={q.placeholder}
                                      onChange={(e) => setWlQuestions(prev => prev.map(p => p.id === q.id ? { ...p, placeholder: e.target.value } : p))}
                                      className="bg-background border-border"
                                      placeholder="Placeholder"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Estilo</label>
                                    <Select value={q.estilo} onValueChange={(v) => setWlQuestions(prev => prev.map(p => p.id === q.id ? { ...p, estilo: v } : p))}>
                                      <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="linha-unica">Linha única</SelectItem>
                                        <SelectItem value="paragrafo">Parágrafo</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Tamanho mínimo <span className="text-red-500">*</span></label>
                                    <Input
                                      type="number"
                                      value={q.tamanhoMin}
                                      onChange={(e) => setWlQuestions(prev => prev.map(p => p.id === q.id ? { ...p, tamanhoMin: Number(e.target.value) } : p))}
                                      className="bg-background border-border"
                                    />
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">Tamanho máximo <span className="text-red-500">*</span></label>
                                    <Input
                                      type="number"
                                      value={q.tamanhoMax}
                                      onChange={(e) => setWlQuestions(prev => prev.map(p => p.id === q.id ? { ...p, tamanhoMax: Number(e.target.value) } : p))}
                                      className="bg-background border-border"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                                  <div>
                                    <h4 className="text-sm font-bold">Pergunta obrigatória?</h4>
                                    <p className="text-xs text-muted-foreground">Será obrigatório responder a esta pergunta para enviar o formulário?</p>
                                  </div>
                                  <Switch
                                    checked={q.obrigatoria}
                                    onCheckedChange={(v) => setWlQuestions(prev => prev.map(p => p.id === q.id ? { ...p, obrigatoria: v } : p))}
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    setWlQuestions(prev => prev.filter(p => p.id !== q.id));
                                    if (openQuestionId === q.id) setOpenQuestionId(null);
                                  }}
                                  className="w-full rounded-lg bg-red-900/40 hover:bg-red-900/60 text-sm font-medium py-3 transition-colors"
                                >
                                  Remover
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verificação apenas pelo usuário mencionado */}
            <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">Verificação apenas pelo usuário mencionado</h3>
                  <p className="text-xs text-primary/80 mt-1">Quando uma nova verificação aparecer, apenas o usuário selecionado na verificação poderá aprovar dentro dos primeiros 5 minutos.</p>
                </div>
                <Switch checked={current.wlMentionedUserOnly} onCheckedChange={(v) => update("wlMentionedUserOnly", v)} disabled={!wl} />
              </div>
            </div>

            {/* Sistema de códigos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">Sistema de códigos</h3>
                  <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">BETA</span>
                </div>
                <Switch checked={current.wlCodeSystem} onCheckedChange={(v) => update("wlCodeSystem", v)} disabled={!wl} />
              </div>
              <p className="text-xs text-muted-foreground">Permitir que membros utilizem o sistema de aprovação por código</p>
            </div>

            {/* Cargos que poderão criar código */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Cargos que poderão criar código (Deixe vazio para permitir todos membros)</p></div>
              <RoleAddButton roles={current.wlCodeRoles} onAdd={(r) => addRole("wlCodeRoles", r)} disabled={!wl} />
            </div>

            {/* Mensagem */}
            <h2 className="font-display text-xl font-bold pt-4">Mensagem</h2>

            {/* Crie mensagens customizadas */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Crie mensagens customizadas ao seu gosto!</p></div>
              <div>
                <label className="mb-2 block text-xs text-muted-foreground">Canal da mensagem de verificação</label>
                <div className="flex items-center gap-3">
                  <Select value={current.wlMessageChannel} onValueChange={(v) => update("wlMessageChannel", v)} disabled={!wl}>
                    <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{channelOptions}</SelectContent>
                  </Select>
                  <Button disabled={!wl || current.wlMessageChannel === "disabled"} className="bg-green-600 hover:bg-green-700 text-primary-foreground shrink-0">Enviar mensagem</Button>
                </div>
              </div>

              {/* Builder Mode */}
              <div>
                <h4 className="text-sm font-bold mb-1">Builder Mode</h4>
                <p className="text-xs text-muted-foreground mb-3">Selecione se o builder mode será usado para criar a mensagem.</p>
                <div className="space-y-2 max-w-md">
                  <button
                    onClick={() => wl && update("wlBuilderMode", "message-builder")}
                    disabled={!wl}
                    className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${current.wlBuilderMode === "message-builder" ? "border-primary bg-primary/10" : "border-border/50 bg-card hover:border-border"}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border"><MessageCircle className="h-4 w-4" /></div>
                    <div>
                      <h5 className="text-sm font-bold">Message Builder</h5>
                      <p className="text-xs text-muted-foreground">Use o construtor de mensagens antigo com content, embeds, botões e menu.</p>
                    </div>
                  </button>
                  <button
                    onClick={() => wl && update("wlBuilderMode", "components-v2")}
                    disabled={!wl}
                    className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${current.wlBuilderMode === "components-v2" ? "border-primary bg-primary/10" : "border-border/50 bg-card hover:border-border"}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border"><LayoutGrid className="h-4 w-4" /></div>
                    <div>
                      <h5 className="text-sm font-bold">Components V2</h5>
                      <p className="text-xs text-muted-foreground">Use os novos componentes de mensagens com o layout atualizado do Discord.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Editor de Mensagem */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Editor de Mensagem</p></div>
              <div className="rounded-lg bg-[hsl(var(--background))] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-xs">⚡</span></div>
                  <span className="text-sm font-bold">KALLY</span>
                  <span className="rounded bg-[#5865F2] px-1 py-0.5 text-[9px] text-white font-bold">BOT</span>
                  <span className="text-xs text-muted-foreground">Hoje às 16:45</span>
                </div>
                <Input
                  value={current.wlMessageText}
                  onChange={(e) => update("wlMessageText", e.target.value)}
                  placeholder="Digite o conteúdo da mensagem!"
                  className="bg-background border-border"
                  disabled={!wl}
                />
                <Button variant="outline" className="mt-2 text-xs" disabled={!wl}>Adicionar embed</Button>
              </div>
            </div>

            {/* Configure o botão de verificação */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Configure o botão de verificação</p></div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-md bg-[#5865F2] px-4 py-2 text-sm text-white font-medium">
                  <span className="text-xs">⊕</span>
                  {current.wlVerifyBtnLabel || "Verificar"}
                </button>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full bg-[#5865F2]" />
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                </div>
              </div>
              <Input
                value={current.wlVerifyBtnLabel}
                onChange={(e) => update("wlVerifyBtnLabel", e.target.value)}
                placeholder="Verificar"
                className="bg-background border-border max-w-xs"
                disabled={!wl}
              />
            </div>

            {/* Configure o botão de utilizar código */}
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4"><p className="text-sm font-bold">Configure o botão de utilizar código</p></div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-md bg-[#5865F2] px-4 py-2 text-sm text-white font-medium">
                  <span className="text-xs">⊕</span>
                  {current.wlCodeBtnLabel || "Utilizar Código"}
                </button>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full bg-[#5865F2]" />
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                </div>
              </div>
              <Input
                value={current.wlCodeBtnLabel}
                onChange={(e) => update("wlCodeBtnLabel", e.target.value)}
                placeholder="Utilizar Código"
                className="bg-background border-border max-w-xs"
                disabled={!wl}
              />
            </div>

            {/* Tipos de menções permitidos */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold">Tipos de menções permitidos</h3>
              <p className="text-xs text-muted-foreground">Controle quais tipos de menções a mensagem poderá utilizar.</p>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg border border-border/50 bg-card p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Menções @everyone e @here</h4>
                  <p className="text-xs text-muted-foreground">Permitir menções @everyone e @here na mensagem.</p>
                </div>
                <Switch checked={current.wlMentionEveryone} onCheckedChange={(v) => update("wlMentionEveryone", v)} disabled={!wl} />
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Menções de cargos</h4>
                  <p className="text-xs text-muted-foreground">Permitir menções de @cargo na mensagem.</p>
                </div>
                <Switch checked={current.wlMentionRoles} onCheckedChange={(v) => update("wlMentionRoles", v)} disabled={!wl} />
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Menções de usuários</h4>
                  <p className="text-xs text-muted-foreground">Permitir menções de @usuário na mensagem.</p>
                </div>
                <Switch checked={current.wlMentionUsers} onCheckedChange={(v) => update("wlMentionUsers", v)} disabled={!wl} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCallTimeContent = () => {
    const ct = current.callTimeEnabled;
    const mov = current.callTimeMovEnabled;
    const tabs = ["Configuração", "Comandos", "Ranking"];
    return (
      <>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Tempo em Call</h1>
            <p className="mt-1 text-muted-foreground">Contabilize o tempo em call dos membros em seu servidor.</p>
          </div>
          <Switch checked={ct} onCheckedChange={(v) => update("callTimeEnabled", v)} />
        </div>

        <div className="relative mt-6">
          {/* Overlay when disabled */}
          {!ct && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/80 backdrop-blur-[1px]">
              <div className="mt-32 rounded-lg border border-border/50 bg-card p-6 text-center shadow-lg max-w-sm w-full">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Volume2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Tempo Em Call</h3>
                <p className="mt-1 text-sm text-muted-foreground">Contabilize o tempo em call dos membros em seu servidor.</p>
                <Button className="mt-4 w-full" onClick={() => update("callTimeEnabled", true)}>Ativar plugin</Button>
              </div>
            </div>
          )}

        <div className="flex gap-6 border-b border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCallTimeTab(tab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
              className={`pb-2 text-sm font-medium transition-colors ${
                callTimeTab === tab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {callTimeTab === "configuracao" && (
          <div className="mt-6 space-y-6">
            {/* Cargos */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold">Configure cargos que contarão tempo em call</h3>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                CARGOS: {current.callTimeRoles.length}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {current.callTimeRoles.map((role) => (
                  <span key={role.id} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm">
                    {role.name}
                    <button onClick={() => update("callTimeRoles", current.callTimeRoles.filter((r) => r.id !== role.id))} className="ml-1 text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Select
                disabled={!ct}
                onValueChange={(v) => {
                  const role = mockRoles.find((r) => r.id === v);
                  if (role && !current.callTimeRoles.some((r) => r.id === role.id)) {
                    update("callTimeRoles", [...current.callTimeRoles, role]);
                  }
                }}
              >
                <SelectTrigger className="mt-3 w-64 bg-background border-border">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.filter((r) => !current.callTimeRoles.some((cr) => cr.id === r.id)).map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Canais */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold">Configure canais que contarão tempo em call</h3>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">ADICIONAR CANAL</p>
              <Select
                disabled={!ct}
                onValueChange={(v) => {
                  const ch = mockVoiceChannels.find((c) => c.id === v);
                  if (ch && !current.callTimeChannels.some((c) => c.id === ch.id)) {
                    update("callTimeChannels", [...current.callTimeChannels, { id: ch.id, name: ch.name, percentage: 100 }]);
                  }
                }}
              >
                <SelectTrigger className="mt-2 w-64 bg-background border-border">
                  <SelectValue placeholder="Selecione um canal" />
                </SelectTrigger>
                <SelectContent>
                  {mockVoiceChannels
                    .filter((c) => !current.callTimeChannels.some((cc) => cc.id === c.id))
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Added channels list */}
              <div className="mt-4 space-y-2">
                {current.callTimeChannels.map((ch) => (
                  <div key={ch.id} className="rounded-lg border border-border/50 bg-background overflow-hidden">
                    <button
                      onClick={() => setExpandedChannel(expandedChannel === ch.id ? null : ch.id)}
                      className="flex w-full items-center justify-between p-3 text-sm font-medium hover:bg-muted/30 transition-colors"
                    >
                      <span>{ch.name} ({ch.percentage}%)</span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${expandedChannel === ch.id ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {expandedChannel === ch.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/50 p-4 flex items-end gap-4">
                            <div>
                              <label className="mb-1 block text-sm font-semibold">Porcentagem de tempo</label>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                value={ch.percentage}
                                onChange={(e) => {
                                  const val = Math.max(1, Math.min(100, Number(e.target.value) || 1));
                                  update("callTimeChannels", current.callTimeChannels.map((c) => c.id === ch.id ? { ...c, percentage: val } : c));
                                }}
                                className="w-24 bg-background border-border"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              onClick={() => update("callTimeChannels", current.callTimeChannels.filter((c) => c.id !== ch.id))}
                            >
                              Deletar
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Contabilizar mutado */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-6">
              <div>
                <h3 className="font-semibold">Contabilizar mutado</h3>
                <p className="text-sm text-muted-foreground">Permitir que conte tempo em call de membro mutado</p>
              </div>
              <Switch disabled={!ct} checked={current.callTimeCountMuted} onCheckedChange={(v) => update("callTimeCountMuted", v)} />
            </div>

            {/* Sistema de movimentação */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-6">
              <div>
                <h3 className="font-semibold">
                  Sistema de movimentação{" "}
                  <span className="ml-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">BETA</span>
                </h3>
                <p className="text-sm text-muted-foreground">Permitir que staffs utilizem o sistema de movimentação</p>
              </div>
              <Switch disabled={!ct} checked={mov} onCheckedChange={(v) => update("callTimeMovEnabled", v)} />
            </div>

            {/* Sub-opções desbloqueadas pelo sistema de movimentação */}
            <div className={`space-y-6 transition-opacity ${mov && ct ? "opacity-100" : "pointer-events-none opacity-30"}`}>
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-6">
                <div>
                  <h3 className="font-semibold">Permitir trocar de canal</h3>
                  <p className="text-sm text-muted-foreground">Permitir que staffs mudem de canal de voz durante uma movimentação</p>
                </div>
                <Switch disabled={!mov || !ct} checked={current.callTimeMovAllowChannelSwitch} onCheckedChange={(v) => update("callTimeMovAllowChannelSwitch", v)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Tempo de movimentação</label>
                  <Input disabled={!mov || !ct} value={current.callTimeMovDuration} onChange={(e) => update("callTimeMovDuration", e.target.value)} className="bg-background border-border" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Pontos por movimentação</label>
                  <Input disabled={!mov || !ct} value={current.callTimeMovPoints} onChange={(e) => update("callTimeMovPoints", e.target.value)} className="bg-background border-border" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold">Canal de Logs</h3>
                </div>
                <Select disabled={!mov || !ct} value={current.callTimeMovLogChannel} onValueChange={(v) => update("callTimeMovLogChannel", v)}>
                  <SelectTrigger className="mt-2 w-64 bg-background border-border">
                    <SelectValue placeholder="Selecione um canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Desativado</SelectItem>
                    <SelectItem value="general">general</SelectItem>
                    <SelectItem value="logs">logs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {callTimeTab === "comandos" && (
          <div className="mt-6">
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold">Lista de comandos</h3>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Pesquisar..." className="pl-9 bg-background border-border" />
              </div>
              <div className="space-y-3">
                {[
                  { cmd: "/resettime", desc: "Utilize para resetar o tempo em call de todos os membros.", key: "callTimeCmdResettime" as const },
                  { cmd: "/resetmovs", desc: "Utilize para resetar as movimentações de todos os membros.", key: "callTimeCmdResetmovs" as const },
                  { cmd: "/movpoints", desc: "Utilize para gerenciar pontos de movimentação.", key: "callTimeCmdMovpoints" as const },
                ].map((item) => (
                  <div key={item.cmd} className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4">
                    <div>
                      <p className="font-bold text-sm">{item.cmd}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="border-border">Editar</Button>
                      <Switch checked={current[item.key]} onCheckedChange={(v) => update(item.key, v)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {callTimeTab === "ranking" && (
          <div className="mt-6">
            <div className="flex flex-col items-center mb-6">
              {serverIcon ? (
                <img src={serverIcon} alt={serverName} className="h-16 w-16 rounded-full" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">{serverName.charAt(0).toUpperCase()}</div>
              )}
              <p className="mt-2 font-bold text-lg">{serverName}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold">Ranking de Tempo em Call</h3>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Pesquisar membro..." className="pl-9 bg-background border-border" />
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Filtro</h4>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">FILTRAR POR CARGO</p>
                <Select defaultValue="none">
                  <SelectTrigger className="w-48 bg-background border-border">
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {mockRoles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground">
                      <th className="py-2 px-3 text-left font-medium w-12">#</th>
                      <th className="py-2 px-3 text-left font-medium">User</th>
                      <th className="py-2 px-3 text-right font-medium">Salvo</th>
                      <th className="py-2 px-3 text-right font-medium">Acumulando</th>
                      <th className="py-2 px-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="py-3 px-3 text-muted-foreground">1</td>
                      <td className="py-3 px-3 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/30 flex items-center justify-center text-xs">K</div>
                        <span>usuario#1234</span>
                      </td>
                      <td className="py-3 px-3 text-right">12h 34m</td>
                      <td className="py-3 px-3 text-right">2h 15m</td>
                      <td className="py-3 px-3 text-right font-semibold">14h 49m</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 border-border" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 border-primary bg-primary/10 text-primary">1</Button>
                <Button variant="outline" size="icon" className="h-8 w-8 border-border" disabled>
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </>
    );
  };

  const renderMovChatContent = () => {
    const mc = current.movChatEnabled;
    const tabs = ["Configuração", "Comandos", "Ranking"];
    return (
      <>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Mov. Chat</h1>
            <p className="mt-1 text-muted-foreground">Contabilize as mensagens em canais de texto de seus staffs.</p>
          </div>
          <Switch checked={mc} onCheckedChange={(v) => update("movChatEnabled", v)} />
        </div>

        <div className="relative mt-6">
          {!mc && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/80 backdrop-blur-[1px]">
              <div className="mt-32 rounded-lg border border-border/50 bg-card p-6 text-center shadow-lg max-w-sm w-full">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Mov. Chat</h3>
                <p className="mt-1 text-sm text-muted-foreground">Contabilize as mensagens em canais de texto de seus staffs.</p>
                <Button className="mt-4 w-full" onClick={() => update("movChatEnabled", true)}>Ativar plugin</Button>
              </div>
            </div>
          )}

          <div className="flex gap-6 border-b border-border/50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setMovChatTab(tab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                className={`pb-2 text-sm font-medium transition-colors ${
                  movChatTab === tab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {movChatTab === "configuracao" && (
            <div className="mt-6 space-y-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold">Configure cargos que contarão mensagens</h3>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  CARGOS: {current.movChatRoles.length}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current.movChatRoles.map((role) => (
                    <span key={role.id} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm">
                      {role.name}
                      <button onClick={() => update("movChatRoles", current.movChatRoles.filter((r) => r.id !== role.id))} className="ml-1 text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select
                  disabled={!mc}
                  onValueChange={(v) => {
                    const role = mockRoles.find((r) => r.id === v);
                    if (role && !current.movChatRoles.some((r) => r.id === role.id)) {
                      update("movChatRoles", [...current.movChatRoles, role]);
                    }
                  }}
                >
                  <SelectTrigger className="mt-3 w-64 bg-background border-border">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold">Configure canais de texto que contarão mensagens</h3>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  CANAIS: {current.movChatChannels.length}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current.movChatChannels.map((ch) => (
                    <span key={ch.id} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm">
                      {ch.name}
                      <button onClick={() => update("movChatChannels", current.movChatChannels.filter((c) => c.id !== ch.id))} className="ml-1 text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select
                  disabled={!mc}
                  onValueChange={(v) => {
                    const ch = mockTextChannels.find((c) => c.id === v);
                    if (ch && !current.movChatChannels.some((c) => c.id === ch.id)) {
                      update("movChatChannels", [...current.movChatChannels, ch]);
                    }
                  }}
                >
                  <SelectTrigger className="mt-3 w-64 bg-background border-border">
                    <SelectValue placeholder="Selecione um canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTextChannels.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold">Limite de Mensagem</h3>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>1</span>
                    <span>60</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={current.movChatMessageLimit}
                    onChange={(e) => update("movChatMessageLimit", Number(e.target.value))}
                    disabled={!mc}
                    className="w-full accent-primary"
                  />
                  <p className="mt-1 text-sm text-muted-foreground">Valor: {current.movChatMessageLimit}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold">Por segundos</h3>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>1</span>
                    <span>60</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={current.movChatSeconds}
                    onChange={(e) => update("movChatSeconds", Number(e.target.value))}
                    disabled={!mc}
                    className="w-full accent-primary"
                  />
                  <p className="mt-1 text-sm text-muted-foreground">Valor: {current.movChatSeconds}</p>
                </div>
              </div>
            </div>
          )}

          {movChatTab === "comandos" && (
            <div className="mt-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold">Lista de comandos</h3>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Pesquisar..." className="pl-9 bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4">
                    <div>
                      <p className="font-bold text-sm">/resetmovchat</p>
                      <p className="text-xs text-muted-foreground">Utilize para resetar os dados de Mov. Chat de todos os membros.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="border-border">Editar</Button>
                      <Switch checked={current.movChatCmdResetmovchat} onCheckedChange={(v) => update("movChatCmdResetmovchat", v)} disabled={!mc} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {movChatTab === "ranking" && (
            <div className="mt-6">
              <div className="flex flex-col items-center mb-6">
                {serverIcon ? (
                  <img src={serverIcon} alt={serverName} className="h-16 w-16 rounded-full" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">{serverName.charAt(0).toUpperCase()}</div>
                )}
                <p className="mt-2 font-bold text-lg">{serverName}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h3 className="font-semibold">Ranking de Mensagens</h3>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Pesquisar membro..." className="pl-9 bg-background border-border" />
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 rounded-full bg-primary" />
                    <h3 className="font-semibold">Filtro</h3>
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">FILTRAR POR CARGO</p>
                  <Select>
                    <SelectTrigger className="mt-2 w-48 bg-background border-border">
                      <SelectValue placeholder="Nenhum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {mockRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground">
                        <th className="py-2 px-3 text-left font-medium">#</th>
                        <th className="py-2 px-3 text-left font-medium text-primary">User</th>
                        <th className="py-2 px-3 text-right font-medium text-primary">Mensagens</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-muted-foreground">Nenhum dado encontrado</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 border-border" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 border-primary bg-primary/10 text-primary">1</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 border-border" disabled>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const igEnabled = current.instagramEnabled;

  const instagramCommandsList = [
    { key: "resetverificacoes", name: "/resetverificacoes", desc: "Utilize para resetar os dados de verificação de todos os staffs." },
    { key: "instagram", name: "/instagram", desc: "Utilize para vincular um instagram ao seu perfil." },
  ];

  const filteredInstagramCommands = instagramCommandsList.filter(
    (c) => c.name.toLowerCase().includes(instagramCmdSearch.toLowerCase()) || c.desc.toLowerCase().includes(instagramCmdSearch.toLowerCase())
  );

  const renderInstagramContent = () => (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">Instagram</h1>
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Update</span>
          </div>
          <p className="mt-1 text-muted-foreground">Permita que seus membros postem fotos, recebam curtidas e comentários.</p>
        </div>
        <Switch checked={igEnabled} onCheckedChange={(v) => update("instagramEnabled", v)} />
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-6 border-b border-border/50">
        {[
          { id: "configuracao", label: "Configuração" },
          { id: "lista", label: "Lista de Instagram" },
          { id: "comandos", label: "Comandos" },
          { id: "ranking", label: "Ranking" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInstagramTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors ${instagramTab === tab.id ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative mt-6 min-h-[400px]">
        <AnimatePresence>
          {!igEnabled && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10 flex items-start justify-center pt-32 rounded-lg bg-background/60 backdrop-blur-sm">
              <div className="rounded-xl border border-border/50 bg-card p-8 text-center shadow-xl max-w-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Instagram className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display text-lg font-bold">Instagram</h3>
                <p className="mt-2 text-sm text-muted-foreground">Permita que seus membros postem fotos, recebam curtidas e comentários.</p>
                <Button onClick={() => update("instagramEnabled", true)} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Ativar plugin</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {instagramTab === "configuracao" && (
          <div className="space-y-8">
            {/* Configurações de Instagram */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Configurações de instagram</h2>
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <Button variant="outline" className="border-border" disabled={!igEnabled} onClick={() => setInstagramCreated(true)}>
                  Criar instagram
                </Button>
                {instagramCreated ? (
                  <div className="rounded-lg border border-border/50 bg-background">
                    <button
                      className="w-full flex items-center justify-between p-4 text-sm text-muted-foreground"
                      disabled={!igEnabled}
                      onClick={() => setInstagramConfigOpen(instagramConfigOpen === 0 ? null : 0)}
                    >
                      <span>Não Configurado.</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${instagramConfigOpen === 0 ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {instagramConfigOpen === 0 && igEnabled && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="border-t border-border/50 p-6 space-y-6">
                            {/* Modelo da mensagem */}
                            <div>
                              <h3 className="font-semibold text-sm">Modelo da mensagem</h3>
                              <p className="text-xs text-muted-foreground mt-1">Selecione o modelo de mensagem que será usado da postagem do instagram.</p>
                              <div className="mt-3 space-y-2">
                                <button
                                  onClick={() => update("instagramMessageModel", "new")}
                                  className={`flex items-center gap-3 w-full max-w-md rounded-lg border p-3 text-left transition-colors ${current.instagramMessageModel === "new" ? "border-primary bg-primary/5" : "border-border bg-background"}`}
                                >
                                  <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Modelo novo</p>
                                    <p className="text-xs text-muted-foreground">Use o modelo de mensagem novo.</p>
                                  </div>
                                </button>
                                <button
                                  onClick={() => update("instagramMessageModel", "old")}
                                  className={`flex items-center gap-3 w-full max-w-md rounded-lg border p-3 text-left transition-colors ${current.instagramMessageModel === "old" ? "border-primary bg-primary/5" : "border-border bg-background"}`}
                                >
                                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Modelo antigo</p>
                                    <p className="text-xs text-muted-foreground">Use o modelo de mensagem antigo.</p>
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* Canal de Instagram */}
                            <div className="rounded-lg border border-border/50 bg-card p-4">
                              <div className="border-l-2 border-primary pl-4">
                                <p className="text-sm font-medium">Canal de Instagram</p>
                              </div>
                              <div className="mt-3">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal</label>
                                <Select value={current.instagramChannel} onValueChange={(v) => update("instagramChannel", v)}>
                                  <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um canal" /></SelectTrigger>
                                  <SelectContent>{channelOptions}</SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Canal de resultados */}
                            <div className="rounded-lg border border-border/50 bg-card p-4">
                              <div className="border-l-2 border-primary pl-4">
                                <p className="text-sm font-medium">Canal de resultados</p>
                              </div>
                              <div className="mt-3">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Canal</label>
                                <Select value={current.instagramResultsChannel} onValueChange={(v) => update("instagramResultsChannel", v)}>
                                  <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um canal" /></SelectTrigger>
                                  <SelectContent>{channelOptions}</SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Cargo de recompensa */}
                            <div className="rounded-lg border border-border/50 bg-card p-4">
                              <div className="border-l-2 border-primary pl-4">
                                <p className="text-sm font-medium">Cargo de recompensa</p>
                              </div>
                              <div className="mt-3">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Cargo</label>
                                <Select value={current.instagramRewardRole} onValueChange={(v) => update("instagramRewardRole", v)}>
                                  <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Desativado" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="disabled">Desativado</SelectItem>
                                    {mockRoles.map((r) => (<SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Emojis */}
                            <div className="rounded-lg border border-border/50 bg-card p-4">
                              <div className="border-l-2 border-primary pl-4">
                                <p className="text-sm font-medium">Emojis (Deixe vazio caso queira utilizar os emojis padrões)</p>
                              </div>
                              <div className="mt-3">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Destaque</label>
                                <button disabled={!igEnabled} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-6">
                                {["Curtida", "Comentário", "Emoji do Instagram", "Listar Interações", "Deletar Postagem"].map((label) => (
                                  <div key={label}>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
                                    <button disabled={!igEnabled} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Permitir vincular instagram */}
                            <div className="flex items-center justify-between py-2">
                              <div>
                                <h3 className="font-semibold text-sm">Permitir vincular instagram</h3>
                                <p className="text-xs text-muted-foreground">Permitir que os membros vinculem instagram em suas postagens</p>
                              </div>
                              <Switch checked={current.instagramAllowLink} onCheckedChange={(v) => update("instagramAllowLink", v)} />
                            </div>

                            {/* Obrigatório vincular instagram */}
                            <div className="flex items-center justify-between py-2">
                              <div>
                                <h3 className="font-semibold text-sm">Obrigatório vincular instagram</h3>
                                <p className="text-xs text-muted-foreground">Com essa opção ativa, os membros só podem postar fotos quando tiverem um instagram vinculado</p>
                              </div>
                              <Switch checked={current.instagramRequireLink} onCheckedChange={(v) => update("instagramRequireLink", v)} />
                            </div>

                            {/* Remover button */}
                            <Button variant="destructive" className="w-full">Remover</Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Configurações de verificação */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Configurações de verificação</h2>
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6">
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm font-medium">Configure o canal de logs de verificação</p>
                    <p className="text-xs text-muted-foreground mt-1">Logs de verificação</p>
                  </div>
                  <div className="mt-3">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Logs de verificação</label>
                    <Select value={current.instagramVerifyLogChannel} onValueChange={(v) => update("instagramVerifyLogChannel", v)} disabled={!igEnabled}>
                      <SelectTrigger className="w-full max-w-xs bg-background border-border"><SelectValue placeholder="Selecione um canal" /></SelectTrigger>
                      <SelectContent>{channelOptions}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm font-medium">Cargos com permissão de verificação</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button disabled={!igEnabled} onClick={() => {
                      const available = mockRoles.filter(r => !current.instagramVerifyRoles.some(vr => vr.id === r.id));
                      if (available.length > 0) update("instagramVerifyRoles", [...current.instagramVerifyRoles, available[0]]);
                    }} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                      <Plus className="h-4 w-4" />
                    </button>
                    {current.instagramVerifyRoles.map((role) => (
                      <span key={role.id} className="flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-medium">
                        {role.name}
                        <button onClick={() => update("instagramVerifyRoles", current.instagramVerifyRoles.filter(r => r.id !== role.id))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm font-medium">Cargos de verificado</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button disabled={!igEnabled} onClick={() => {
                      const available = mockRoles.filter(r => !current.instagramVerifiedRoles.some(vr => vr.id === r.id));
                      if (available.length > 0) update("instagramVerifiedRoles", [...current.instagramVerifiedRoles, available[0]]);
                    }} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                      <Plus className="h-4 w-4" />
                    </button>
                    {current.instagramVerifiedRoles.map((role) => (
                      <span key={role.id} className="flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-medium">
                        {role.name}
                        <button onClick={() => update("instagramVerifiedRoles", current.instagramVerifiedRoles.filter(r => r.id !== role.id))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {instagramTab === "lista" && (
          <div>
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="border-l-2 border-primary pl-4 mb-4">
                <p className="text-sm font-medium">Lista de Instagram</p>
              </div>
              <p className="text-sm text-muted-foreground">Nenhum dado encontrado.</p>
            </div>
          </div>
        )}

        {instagramTab === "comandos" && (
          <div>
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="border-l-2 border-primary pl-4 mb-4">
                <p className="text-sm font-medium">Lista de comandos</p>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={instagramCmdSearch}
                  onChange={(e) => setInstagramCmdSearch(e.target.value)}
                  className="pl-9 bg-background border-border"
                  disabled={!igEnabled}
                />
              </div>
              <div className="space-y-3">
                {filteredInstagramCommands.map((cmd) => (
                  <div key={cmd.key} className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-4">
                    <div>
                      <p className="text-sm font-semibold">{cmd.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cmd.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="border-border" disabled={!igEnabled}>Editar</Button>
                      <Switch
                        checked={current.instagramCommands[cmd.key] ?? true}
                        onCheckedChange={(v) => update("instagramCommands", { ...current.instagramCommands, [cmd.key]: v })}
                        disabled={!igEnabled}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {instagramTab === "ranking" && (
          <div>
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <div className="border-l-2 border-primary pl-4 mb-4">
                <p className="text-sm font-medium">Ranking de Instagram</p>
              </div>
              <p className="text-sm text-muted-foreground">Nenhum dado encontrado.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );


  const renderPlaceholderContent = (title: string, description: string) => (
    <>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-lg border border-dashed border-border/50 p-12 text-center">
        <p className="text-muted-foreground">Em breve</p>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "settings": return renderSettingsContent();
      case "permissions": return renderPermissionsContent();
      case "uri-protection": return renderUriProtectionContent();
      case "server-protection": return renderServerProtectionContent();
      case "moderation": return renderModerationContent();
      case "event-logs": return renderEventLogsContent();
      case "counters": return renderCountersContent();
      case "bio-checker": return renderBioCheckerContent();
      case "autorole": return renderAutoroleContent();
      case "whitelist": return renderWhitelistContent();
      case "call-time": return renderCallTimeContent();
      case "dashboard": return renderPlaceholderContent("Dashboard", "Visão geral do servidor");
      case "financial": return renderPlaceholderContent("Financeiro", "Gerencie suas assinaturas");
      case "custom-modules": return renderPlaceholderContent("Custom Modules", "Crie módulos personalizados");
      case "auto-reactions": return renderPlaceholderContent("Reações Automáticas", "Configure reações automáticas");
      case "welcome": return renderPlaceholderContent("Bem vindo & Adeus", "Configure mensagens de entrada e saída");
      case "messages": return renderPlaceholderContent("Mensagens", "Configure mensagens automáticas");
      case "utilities": return renderPlaceholderContent("Utilitários", "Configure utilitários do servidor");
      case "shop": return renderPlaceholderContent("Loja", "Configure a loja do servidor");
      case "mov-chat": return renderMovChatContent();
      case "mig-rec": return renderPlaceholderContent("Mig & Rec", "Configure migrações e recrutamento");
      case "registro": return renderPlaceholderContent("Registro", "Configure o sistema de registro");
      case "primeira-dama": return renderPlaceholderContent("Primeira Dama", "Configure o sistema de primeira dama");
      case "panela": return renderPlaceholderContent("Panela", "Configure o sistema de panela");
      case "instagram": return renderInstagramContent();
      case "influencers": return renderPlaceholderContent("Influencers", "Configure o sistema de influencers");
      case "tellonym": return renderPlaceholderContent("Tellonym", "Configure integração com Tellonym");
      case "tickets": return renderPlaceholderContent("Tickets", "Configure o sistema de tickets");
      case "vips": return renderPlaceholderContent("Vips", "Configure o sistema de VIPs");
      default: return renderSettingsContent();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Banner />
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 flex h-screen w-[340px] shrink-0 flex-col border-r border-border/50 bg-sidebar">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center justify-center h-[60px] border-b border-border/50 transition-colors hover:opacity-80">
            <span className="font-display text-xl font-bold tracking-tight">
              <span className="gradient-text">K</span>ally
            </span>
          </Link>
          {/* Server info */}
          <div className="flex items-center gap-3 px-4 py-3 mb-1">
            {serverIcon ? (
              <img src={serverIcon} alt={serverName} className="h-8 w-8 shrink-0 rounded-full" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0 text-sm font-bold">
                {serverName.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="truncate text-sm font-medium text-foreground">{serverName}</p>
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-none px-2 py-1">
            {sidebarGroups.map((group, gi) => (
              <div key={gi} className="mb-1">
                {group.title && (
                  <button
                    onClick={() => group.collapsible && toggleGroup(group.title!)}
                    className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    {group.title}
                    {group.collapsible && (collapsedGroups[group.title] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />)}
                  </button>
                )}
                <AnimatePresence initial={false}>
                  {(!group.title || !collapsedGroups[group.title!]) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                            activeSection === item.id
                              ? "bg-sidebar-accent text-foreground"
                              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                          }`}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Top bar aligned with sidebar logo */}
          <div className="flex items-center justify-end px-6 h-[60px] border-b border-border/50 relative">
            <div className="relative">
              {(() => {
                const discordUser = (() => { try { const raw = localStorage.getItem("discord_user"); return raw ? JSON.parse(raw) : null; } catch { return null; } })();
                const avatarSrc = discordUser?.avatar
                  ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=128`
                  : "https://cdn.discordapp.com/embed/avatars/0.png";
                const displayName = discordUser?.global_name || discordUser?.username || "Usuário";
                return (
                  <>
                    <img
                      src={avatarSrc}
                      alt="User avatar"
                      className="h-9 w-9 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                    />
                    <AnimatePresence>
                      {avatarMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 z-50 w-56 rounded-md border border-border/50 bg-popover shadow-lg overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border/50">
                            <p className="text-xs text-muted-foreground">Seja Bem-vindo(a)</p>
                            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                              onClick={() => { localStorage.removeItem("discord_token"); localStorage.removeItem("discord_user"); navigate("/"); }}
                            >
                              <LogOut className="h-4 w-4" />
                              Sair
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                );
              })()}
            </div>
          </div>
          <div className="flex-1 p-8">
          <div className="mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </main>
      </div>

      {/* Save bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-6 py-3 shadow-2xl">
              <p className="text-sm text-muted-foreground">Alterações não salvas</p>
              <Button variant="outline" size="sm" onClick={handleDiscard} className="gap-2 border-border">
                <RotateCcw className="h-3.5 w-3.5" />
                Descartar
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="h-3.5 w-3.5" />
                Salvar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServerSettings;
