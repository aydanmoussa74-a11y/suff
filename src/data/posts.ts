import type { UiPost } from "@/lib/types";

const brass = [
  { name: "bg", hex: "#07080b", role: "bg" as const },
  { name: "surface", hex: "#12141a", role: "surface" as const },
  { name: "text", hex: "#f4f1ea", role: "text" as const },
  { name: "muted", hex: "#9a958c", role: "muted" as const },
  { name: "accent", hex: "#d7b56d", role: "accent" as const },
  { name: "stroke", hex: "#222530", role: "stroke" as const },
];

export const posts: UiPost[] = [
  {
    id: "post_balance",
    slug: "glass-balance",
    kind: "component",
    title: "Glass balance",
    summary: "Compact balance card with brass accent and a quiet action row.",
    author: { handle: "ada", name: "Ada Okon", avatarUrl: "", tier: "curator" },
    frameworks: ["flutter"],
    tags: ["card", "finance"],
    likeCount: 128,
    saved: false,
    preview: { src: "", alt: "Dark balance card with brass total", width: 390, height: 520 },
    palette: brass,
    snippets: [
      {
        framework: "flutter",
        language: "dart",
        filename: "balance_card.dart",
        code: "class BalanceCard extends StatelessWidget {\n  const BalanceCard({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return const Text('Available');\n  }\n}\n",
      },
    ],
    steps: [],
    createdAt: "2026-04-02T10:00:00.000Z",
  },
  {
    id: "post_login",
    slug: "sign-in-sheet",
    kind: "screen",
    title: "Sign-in sheet",
    summary: "Bottom sheet sign-in with email field and a single primary action.",
    author: { handle: "leo", name: "Leo Mensah", avatarUrl: "", tier: "pro" },
    frameworks: ["react"],
    tags: ["auth", "sheet"],
    likeCount: 86,
    saved: true,
    preview: { src: "", alt: "Sign-in sheet on a dark surface", width: 390, height: 440 },
    palette: brass,
    snippets: [
      {
        framework: "react",
        language: "tsx",
        filename: "SignInSheet.tsx",
        code: "export function SignInSheet() {\n  return <form aria-label=\"Sign in\" />;\n}\n",
      },
    ],
    steps: [],
    createdAt: "2026-04-08T10:00:00.000Z",
  },
  {
    id: "post_transfer",
    slug: "transfer-review",
    kind: "screen",
    title: "Transfer review",
    summary: "Confirm screen with amount, recipient, and a hold-to-send control.",
    author: { handle: "mina", name: "Mina Rahman", avatarUrl: "", tier: "member" },
    frameworks: ["swiftui"],
    tags: ["finance", "confirm"],
    likeCount: 64,
    saved: false,
    preview: { src: "", alt: "Transfer review screen", width: 390, height: 560 },
    palette: brass,
    snippets: [
      {
        framework: "swiftui",
        language: "swift",
        filename: "TransferReview.swift",
        code: "struct TransferReview: View {\n  var body: some View { Text(\"Review\") }\n}\n",
      },
    ],
    steps: [],
    createdAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "post_settings",
    slug: "settings-list",
    kind: "component",
    title: "Settings list",
    summary: "Grouped settings rows with a brass selected state.",
    author: { handle: "ada", name: "Ada Okon", avatarUrl: "", tier: "curator" },
    frameworks: ["compose"],
    tags: ["list", "settings"],
    likeCount: 41,
    saved: false,
    preview: { src: "", alt: "Settings list on a dark background", width: 390, height: 480 },
    palette: brass,
    snippets: [
      {
        framework: "compose",
        language: "kotlin",
        filename: "SettingsList.kt",
        code: "@Composable\nfun SettingsList() {\n  Text(\"Settings\")\n}\n",
      },
    ],
    steps: [],
    createdAt: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "post_chips",
    slug: "filter-chips",
    kind: "component",
    title: "Filter chips",
    summary: "Scrollable framework chips with a brass active pill.",
    author: { handle: "leo", name: "Leo Mensah", avatarUrl: "", tier: "pro" },
    frameworks: ["flutter", "react"],
    tags: ["chips", "filter"],
    likeCount: 203,
    saved: true,
    preview: { src: "", alt: "Horizontal filter chips", width: 390, height: 360 },
    palette: brass,
    snippets: [
      {
        framework: "react",
        language: "tsx",
        filename: "FilterChips.tsx",
        code: "export function FilterChips() {\n  return <div role=\"tablist\" />;\n}\n",
      },
    ],
    steps: [],
    createdAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "post_splash",
    slug: "welcome-splash",
    kind: "screen",
    title: "Welcome splash",
    summary: "First screen of a short onboarding flow. Mark and one line of copy.",
    author: { handle: "mina", name: "Mina Rahman", avatarUrl: "", tier: "member" },
    frameworks: ["swiftui", "compose"],
    tags: ["onboarding", "splash"],
    likeCount: 97,
    saved: false,
    preview: { src: "", alt: "Welcome splash with centered mark", width: 390, height: 600 },
    palette: brass,
    snippets: [],
    steps: [],
    createdAt: "2026-06-18T10:00:00.000Z",
  },
  {
    id: "post_html_chip",
    slug: "html-chip",
    kind: "component",
    title: "HTML chip",
    summary: "A single web chip you can preview in the sandbox.",
    author: { handle: "leo", name: "Leo Mensah", avatarUrl: "", tier: "pro" },
    frameworks: ["html", "react"],
    tags: ["web", "chip"],
    likeCount: 36,
    saved: false,
    preview: { src: "", alt: "Brass chip on a dark page", width: 390, height: 320 },
    palette: brass,
    snippets: [
      {
        framework: "html",
        language: "html",
        filename: "chip.html",
        code: "<button style=\"background:#d7b56d;color:#1a1408;border:0;border-radius:999px;padding:10px 14px;font:600 14px sans-serif\">Flutter</button>\n",
      },
      {
        framework: "react",
        language: "tsx",
        filename: "Chip.tsx",
        code: "export function Chip() {\n  return <button type=\"button\">Flutter</button>;\n}\n",
      },
    ],
    steps: [],
    createdAt: "2026-07-04T10:00:00.000Z",
  },
  {
    id: "post_kyc_flow",
    slug: "account-onboarding",
    kind: "flow",
    title: "Account onboarding",
    summary: "Five-step sample journey: splash, sign-in, document frame, face-check status, verified.",
    author: { handle: "ada", name: "Ada Okon", avatarUrl: "", tier: "curator" },
    frameworks: ["flutter", "swiftui"],
    tags: ["onboarding", "flow"],
    likeCount: 154,
    saved: false,
    preview: { src: "", alt: "Onboarding splash", width: 390, height: 560 },
    palette: brass,
    snippets: [],
    steps: [
      {
        id: "splash",
        index: 1,
        title: "Splash",
        caption: "Mark and one line of copy before the sign-in sheet.",
        preview: { src: "", alt: "Splash screen with centered mark", width: 390, height: 560 },
        snippets: [
          {
            framework: "flutter",
            language: "dart",
            filename: "splash_screen.dart",
            code: "class SplashScreen extends StatelessWidget {\n  const SplashScreen({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return const Center(child: Text('Suff'));\n  }\n}\n",
          },
        ],
      },
      {
        id: "login",
        index: 2,
        title: "Animated login",
        caption: "Email field and a single continue action on a rising sheet.",
        preview: { src: "", alt: "Sign-in sheet", width: 390, height: 560 },
        snippets: [
          {
            framework: "flutter",
            language: "dart",
            filename: "login_sheet.dart",
            code: "class LoginSheet extends StatelessWidget {\n  const LoginSheet({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return const TextField(decoration: InputDecoration(labelText: 'Email'));\n  }\n}\n",
          },
          {
            framework: "swiftui",
            language: "swift",
            filename: "LoginSheet.swift",
            code: "struct LoginSheet: View {\n  var body: some View {\n    TextField(\"Email\", text: .constant(\"\"))\n  }\n}\n",
          },
        ],
      },
      {
        id: "document",
        index: 3,
        title: "Document scan",
        caption: "Capture frame layout. A sample screen, not a document checker.",
        preview: { src: "", alt: "Document frame overlay", width: 390, height: 560 },
        snippets: [
          {
            framework: "flutter",
            language: "dart",
            filename: "document_frame.dart",
            code: "class DocumentFrame extends StatelessWidget {\n  const DocumentFrame({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return const Text('Align the page in the frame');\n  }\n}\n",
          },
        ],
      },
      {
        id: "face",
        index: 4,
        title: "Face verification",
        caption: "Status screen for a face check. Layout only.",
        preview: { src: "", alt: "Face check status screen", width: 390, height: 560 },
        snippets: [
          {
            framework: "swiftui",
            language: "swift",
            filename: "FaceStatus.swift",
            code: "struct FaceStatus: View {\n  var body: some View { Text(\"Checking\") }\n}\n",
          },
        ],
      },
      {
        id: "verified",
        index: 5,
        title: "Verified",
        caption: "Done state with a return-to-home action.",
        preview: { src: "", alt: "Verified confirmation", width: 390, height: 560 },
        snippets: [
          {
            framework: "flutter",
            language: "dart",
            filename: "verified_screen.dart",
            code: "class VerifiedScreen extends StatelessWidget {\n  const VerifiedScreen({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return const Text('Verified');\n  }\n}\n",
          },
        ],
      },
    ],
    createdAt: "2026-07-01T10:00:00.000Z",
  },
];

export function filterPosts(framework?: string) {
  const screens = posts.filter((post) => post.kind !== "flow");
  if (!framework || framework === "all") return screens;
  return screens.filter((post) => post.frameworks.includes(framework as UiPost["frameworks"][number]));
}

export function flowPosts() {
  return posts.filter((post) => post.kind === "flow" && post.steps.length > 0);
}

export function sandboxEntries() {
  return posts.flatMap((post) => {
    const own = post.snippets.map((snippet) => ({
      id: `${post.slug}-${snippet.filename}`,
      title: post.title,
      snippet,
    }));
    const steps = post.steps.flatMap((step) =>
      step.snippets.map((snippet) => ({
        id: `${post.slug}-${step.id}-${snippet.filename}`,
        title: `${post.title} · ${step.title}`,
        snippet,
      })),
    );
    return [...own, ...steps];
  });
}
