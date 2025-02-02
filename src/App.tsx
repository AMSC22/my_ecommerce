import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import HomePage from "./pages/HomePage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import CartPage from "./pages/PaymentProcess/CartPage.tsx";
import PaymentPage from "./pages/PaymentProcess/PaymentPage.tsx";
import SignupPage from "./pages/LoginAndRegister/SignupPage.tsx";
import LoginPage from "./pages/LoginAndRegister/LoginPage.tsx";
import ResetPasswordPage from "./pages/LoginAndRegister/ResetPasswordPage.tsx";
import LogoutButton from "./components/LogoutButton.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx";
import WishlistPage from "./pages/WishlistPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ProductDetailsPage from "./pages/ProductDetailPage.tsx";
import DeliveryPage from "./pages/PaymentProcess/DeliveryPage.tsx";
import ConfirmationPage from "./pages/PaymentProcess/ConfirmationPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import CreateCategoryPage from "./pages/Admin/CreateCategoryPage.tsx";
import PostProductPage from "./pages/PostProductPage.tsx";
import MessagingPage from "./pages/MessagingPage.tsx";
import AdminProductValidationPage from "./pages/Admin/AdminProductValidationPage.tsx";
import AdminCategoryValidationPage from "./pages/Admin/AdminCategoryValidationPage.tsx";
import PurchaseHistoryPage from "./pages/PurchaseHoriryPage.tsx";
import SalesHistoryPage from "./pages/Sellers/SalesHistoryPage.tsx";
import AdminHistoryPage from "./pages/Admin/AdminHistoryPage.tsx";
import AdminStatePage from "./pages/Admin/AdminStatePage.tsx";
import AffiliationPage from "./pages/AffiliationPage.tsx";
import AdminUserManagementPage from "./pages/Admin/AdminUserManagementPage.tsx";
import AdminOrderManagementPage from "./pages/Orders/AdminOrderManagementPage.tsx";
import AdminPaymentsPage from "./pages/Admin/AdminPaymentPage.tsx";
import PrivacyPolicyPage from "./pages/TermsAndPolicy/PivacyPolicyPage.tsx";
import TermsAndConditionsPage from "./pages/TermsAndPolicy/TermsAndConditionsPage.tsx";
import FavoritesPage from "./pages/FavoritesPage.tsx";
import NotificationsPage from "./pages/NotificationsPage.tsx";
import SubscriptionPage from "./pages/SubscriptionPage.tsx";
import AdvancedSearchPage from "./pages/AdvancedSearchPage.tsx";
import ReturnRequestPage from "./pages/ReturnPage/ReturnRequestPage.tsx";
import ReturnManagementPage from "./pages/ReturnPage/ReturnManagementPage.tsx";
import ReturnApprovalPage from "./pages/ReturnPage/ReturnApprovalPage.tsx";
import ReturnStatusPage from "./pages/ReturnPage/ReturnStatusPage.tsx";
import BuyerDashboardPage from "./pages/Dashboard/BuyerPage.tsx";
import SellerDashboardPage from "./pages/Dashboard/SellerPage.tsx";
import SellerProductsPage from "./pages/Sellers/SellerProductsPage.tsx";
import AdminTicketsPage from "./pages/SupportClient/AdminTicketPage.tsx";
import UserTicketsPage from "./pages/SupportClient/UserTicketPage.tsx";
import SubmitTicketPage from "./pages/SupportClient/SubmitTicketPage.tsx";
import BuyerOrdersPage from "./pages/Orders/BuyerOrderPage.tsx";
import SellerOrdersPage from "./pages/Orders/SellerOrderPage.tsx";
import AdminDashboardPage from "./pages/Dashboard/AdminPage.tsx";
import OtherProfilePage from "./pages/OtherProfilePage.tsx";
import AdminReviewManagementPage from "./pages/Admin/AdminReviewManagementPage.tsx";
import UserProfilePage from "./pages/Admin/UserProfilePage.tsx";
import AdminUserManagementEditPage from "./pages/Admin/AdminUserManagementEdit.tsx";
import CategoryManagementPage from "./pages/Admin/CategoryManagementPage.tsx";
import SellerReviewPage from "./pages/Sellers/SellerReviewPage.tsx";

const App: React.FC = () => {
  const status: string = "admin";
  const isLoggedIn: boolean = true;
  let path: any;

  if(isLoggedIn){
  if (status === "buyer"){ path = <BuyerDashboardPage />; }
  else if (status === "seller"){ path = <SellerDashboardPage />; }
  else if (status === "admin"){ path = <AdminDashboardPage />; }}
  else { path = <HomePage />; }

  return (
    <Router>
      <div className="app">
        <header>
        {/* Navbar global */}
        <Navbar
          isLoggedIn={isLoggedIn} // Change selon l'état de connexion de l'utilisateur
          status={status}
          onLogout={() => console.log("Déconnexion")}
        />
        </header>

        {/* Contenu principal */}
        <main className="p-4 content">
          <Routes>
            {/* <Route path="/" element={<CategoriesPage />} /> */}
            <Route path="/" element={path} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<AdvancedSearchPage />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
            
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductDetailsPage />} />
            <Route path="/post-product" element={<PostProductPage />} />

            <Route path="/seller-products" element={<SellerProductsPage />} />
            <Route path="/seller-orders" element={<SellerOrdersPage />} />
            <Route path="/buyer-orders" element={<BuyerOrdersPage />} />
            <Route path="/seller-reviews" element={<SellerReviewPage />} />

            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/affiliation" element={<AffiliationPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
            <Route path="/other-profile" element={<OtherProfilePage />} />
            
            <Route path="/admin-user-management" element={<AdminUserManagementPage />} />
            <Route path="/admin-order-management" element={<AdminOrderManagementPage />} />
            <Route path="/admin-payments" element={<AdminPaymentsPage />} />
            <Route path="/admin-validation-product" element={<AdminProductValidationPage />} />
            <Route path="/admin-validation-category" element={<AdminCategoryValidationPage />} />
            <Route path="/admin-statistics" element={<AdminStatePage />} />
            <Route path="/admin-review-management" element={<AdminReviewManagementPage />} />
            <Route path="/admin-user-profile/:userId" element={<UserProfilePage />} />
            <Route path="/admin-user-management/edit/:userId" element={<AdminUserManagementEditPage />} />
            <Route path="/admin-category-management" element={<CategoryManagementPage />} />
            <Route path="/admin-history" element={<AdminHistoryPage />} />
            <Route path="/admin-tickets" element={<AdminTicketsPage />} />
            <Route path="/admin-create-category" element={<CreateCategoryPage />} />

            <Route path="/wishlist" element={<WishlistPage />} />
          
            <Route path="/cart" element={<CartPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          
            <Route path="/register" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/logout" element={<LogoutButton />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/message" element={<MessagingPage />}></Route>
            <Route path="/notifications" element={<NotificationsPage />}></Route>
          
            <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
            <Route path="/sales-history" element={<SalesHistoryPage />} />

            <Route path="/return-request" element={<ReturnRequestPage />} />
            <Route path="/return-status" element={<ReturnStatusPage />} />
            <Route path="/return-management" element={<ReturnManagementPage />} />
            <Route path="/return-approval" element={<ReturnApprovalPage />} />

            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            
            <Route path="user-tickets" element={<UserTicketsPage />} />
            <Route path="submit-ticket" element={<SubmitTicketPage />} />
            <Route path="*" element={<NotFoundPage />} />
          
          </Routes>
        </main>
        <footer>
        {/* Footer global */}
        <Footer />
        </footer>
      </div>
    </Router>
  );
};

export default App;
