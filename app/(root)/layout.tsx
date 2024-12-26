import Header from "@/components/Header"
import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import { getCurrentUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"

const layout = async ({ children }: { children: React.ReactNode }) => {
    const CurrentUser = await getCurrentUser();
    if (!CurrentUser) return redirect("/sign-in")
    return (
        <main className='flex h-screen'>
            <Sidebar />
            <section className='flex flex-col flex-1 h-full'>
                <MobileNav />
                <Header />
                <div className='main-content'>{children}</div>
            </section>
        </main>
    )

}

export default layout
