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
            <header>
                <h1>MemoryLane-Digital Time Capsule Platform</h1>
                <Link>+ Create Capsule</Link>
            </header>
            <section>
                <CapsuleCard/>

            </section>
        </main>
    )
}