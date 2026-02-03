const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jqxvzofroxrbglwnqstg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHZ6b2Zyb3hyYmdsd25xc3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzEyMDksImV4cCI6MjA4NTcwNzIwOX0.eGJFS57nt6n5DIeYz6FvJSWMWDpbrQhnqkXmUyWOY-8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log("1. Attempting to insert a test record...");

    const { data, error } = await supabase
        .from('requests')
        .insert([
            {
                recipient_name: 'Test User',
                sender_name: 'Antigravity Verification',
                evasion_mode: 'ghost'
            },
        ])
        .select();

    if (error) {
        console.error("❌ Failed to insert record.");
        console.error("Error details:", error);
        console.log("\nPossible causes:");
        console.log("- The SQL script wasn't run successfully.");
        console.log("- RLS policies (Row Level Security) prevent inserting.");
    } else {
        console.log("✅ Success! Record inserted.");
        console.log("Data:", data);
        console.log("\nThis confirms that:");
        console.log("1. The 'requests' table exists.");
        console.log("2. The connection credentials are correct.");
        console.log("3. Write permissions are active.");
    }
}

testConnection();
