export const CountdownTimer = ({unlockDate})=>{
    const diff = new Date(unlockDate) - new Date();
    const days = Math.max(Math.floor(diff/(1000*60*60*24)),0);
    return(
        <p>
         ⏳ {days} days remaining   
        </p>
    );
};