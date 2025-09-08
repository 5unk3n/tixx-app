import { BrowserRouter, Route, Routes } from 'react-router'

import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

import ChannelLayout from '@/components/layouts/ChannelLayout'
import EventsLayout from '@/components/layouts/EventsLayout'
import MainLayout from '@/components/layouts/MainLayout'
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage'
import FindPasswordPage from '@/pages/auth/FindPasswordPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import CreateEventPage from '@/pages/events/CreateEventPage'
import EditEventListPage from '@/pages/events/EditEventListPage'
import EditEventPage from '@/pages/events/EditEventPage'
import CreateHostPage from '@/pages/hosts/CreateHostPage'
import HostPage from '@/pages/hosts/HostOverviewPage'
import HostSettingsPage from '@/pages/hosts/HostSettingsPage'
import InsightPage from '@/pages/hosts/InsightPage'
import SettlementPage from '@/pages/hosts/SettlementPage'
import UpdateHostPage from '@/pages/hosts/UpdateHostPage'
import InquiryPage from '@/pages/inquiries/InquiryPage'
import MainDetailPage from '@/pages/MainDetailPage'
import MainPage from '@/pages/MainPage'
import MyPage from '@/pages/MyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import Onboarding from '@/pages/OnboardingPage'
import QRPage from '@/pages/qrcode/QRPage'
import QRResultPage from '@/pages/qrcode/QRResultPage'
import CreateTicketPage from '@/pages/tickets/CreateTicketPage'
import InvitationPage from '@/pages/tickets/InvitationPage'
import SendTicketPage from '@/pages/tickets/SendTicketPage'
export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PublicRoute />}>
					<Route element={<MainLayout />}>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/find-password" element={<FindPasswordPage />} />
						<Route path="/client-user/find" element={<ChangePasswordPage />} />
					</Route>
				</Route>
				<Route element={<PrivateRoute />}>
					<Route element={<MainLayout />}>
						<Route index element={<MainPage />} />
						<Route path="/onboarding" element={<Onboarding />} />
						<Route path="/events/:id" element={<MainDetailPage />} />
						<Route path="/events/:id/invitation" element={<InvitationPage />} />
						<Route path="/mypage" element={<MyPage />} />
						<Route path="/" element={<MyPage />} />
						<Route path="/inquiry" element={<InquiryPage />} />
					</Route>
					<Route path="/channel" element={<ChannelLayout />}>
						<Route path="overview" element={<HostPage />} />
						<Route path="settings" element={<HostSettingsPage />} />
						<Route path="settlement" element={<SettlementPage />} />
						<Route path="create" element={<CreateHostPage />} />
						<Route path="update/:id" element={<UpdateHostPage />} />
						<Route path="insight" element={<InsightPage />} />
					</Route>
					<Route path="/events" element={<EventsLayout />}>
						<Route path="create" element={<CreateEventPage />} />
						<Route path="edit" element={<EditEventListPage />} />
						<Route path="edit/:id" element={<EditEventPage />} />
						<Route path="ticket" element={<CreateTicketPage />} />
						<Route path="invite" element={<SendTicketPage />} />
					</Route>
					<Route path="/scan" element={<QRPage />} />
					<Route path="/scan/result" element={<QRResultPage />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	)
}
