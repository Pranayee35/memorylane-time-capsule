import { Link } from "react-router-dom";
import { CapsuleCard } from "../components/CapsuleCard";
import { Helmet } from "react-helmet-async";

export const Dashboard = ()=>{
    return (
        <main>
           <Helmet>
            <title>MemoryLane | Digital Time Capsule Platform</title>
            <meta name="description" content="Preserve family memories as digital time capsules that unlock in the future."/>
            </Helmet> 
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">MemoryLane-Digital Time Capsule Platform</h1>
                <Link to="/create" className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 mr-7 mt-4 rounded-lg font-medium">+ Create Capsule</Link>
            </header>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CapsuleCard/>
                <CapsuleCard/>
                <CapsuleCard/>

            </section>
        </main>
    )
}