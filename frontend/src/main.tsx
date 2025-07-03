import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/sonner"
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const appQueryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={appQueryClient}>
		<StrictMode>
			<App />
			<Toaster />
		</StrictMode>
	</QueryClientProvider>
)
