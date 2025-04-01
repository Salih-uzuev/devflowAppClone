import {auth} from "@/auth";



const Home = async ()=> {

    const session = await auth();


    return(

        <>

            <h1 className="h1-bold font-space-grotesk" >Welcome to the world of next.js 15 !</h1>


        </>

    );
}


export default Home;

