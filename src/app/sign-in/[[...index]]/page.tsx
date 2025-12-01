import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-gray-800 border-gray-700 hover:bg-gray-750 text-white",
            socialButtonsBlockButtonText: "text-white font-medium",
            formButtonPrimary: "bg-white hover:bg-gray-100 text-black font-semibold shadow-lg",
            formFieldLabel: "text-gray-300 font-medium",
            formFieldInput: "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500",
            footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
            dividerLine: "bg-gray-700",
            dividerText: "text-gray-500",
            formFieldOptionalBadge: "text-gray-500 bg-gray-800 border-gray-700",
            footerActionText: "text-gray-500",
            identityPreviewText: "text-white",
            formFieldSuccessText: "text-green-400",
            formFieldErrorText: "text-red-400",
            formFieldHintText: "text-gray-500",
            formFieldInfoText: "text-gray-500",
            badge: "text-gray-500 bg-gray-800/50 border-gray-700",
          },
          layout: {
            socialButtonsPlacement: "top",
            socialButtonsVariant: "blockButton",
          },
        }}
      />
    </div>
  )
}