    import { createClient } from "@supabase/supabase-js";

export async function getEvents(id:any){
    // Replace with the correct initialization, e.g. using createClient
    const supbase = createClient(id.supabaseUrl, id.supabaseKey);
    
     const {data,error} = await supbase.from('events')
     .select("*")
     if(!error){
         console.log("Error fetching companies",data);
         
}
return data
}