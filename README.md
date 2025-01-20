# Template front-end code created by lovable.dev
TODO:
### DONE Connect supabase backend DONE
### DONE Connected supabase to frontend for leaderboard and session functionality DONE
### Create deployment via github actions
### Host website for use


# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

To fully use this add supabaseClient.ts to the lib file and add this code
```
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR URL'
const supabaseKey = 'YOUR ANON KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
```