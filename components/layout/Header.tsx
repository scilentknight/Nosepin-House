// // "use client";

// // import Link from "next/link";
// // import Image from "next/image";
// // import { useRouter } from "next/navigation";
// // import { useEffect, useRef, useState } from "react";
// // import { useSession, signOut } from "next-auth/react";

// // export const announcements = [
// //   "100% Natural Diamonds - SGL Certified",
// //   "Free Shipping All Over Nepal",
// //   "BIS Hallmarked Gold | SGL Certified Diamonds",
// // ];

// // import {
// //   Menu,
// //   Search,
// //   User,
// //   ShoppingCart,
// //   Heart,
// //   ChevronDown,
// //   LayoutDashboard,
// //   Package,
// //   LogOut,
// // } from "lucide-react";
// // import { useCart } from "@/context/CartContext";
// // import { useWishlist } from "@/context/WishlistContext";
// // import { NotificationBell } from "@/components/layout/NotificationBell";
// // import { Logo } from "@/components/layout/Logo";
// // import { formatPrice } from "@/lib/format";

// // const NAV_LINKS = [
// //   { id: "home", href: "/", label: "Home" },
// //   { id: "jewellery", href: "/jewellery", label: "Jewellery" },
// //   { id: "about", href: "/about", label: "About Us" },
// //   { id: "contact", href: "/contact", label: "Contact" },
// // ];

// // type ProductSuggestion = {
// //   id: number;
// //   name: string;
// //   slug: string;
// //   price: number;
// //   image: string | null;
// // };

// // function SearchBox({
// //   value,
// //   onChange,
// //   onSubmit,
// //   onNavigate,
// // }: {
// //   value: string;
// //   onChange: (value: string) => void;
// //   onSubmit: () => void;
// //   onNavigate?: () => void;
// // }) {
// //   const router = useRouter();
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const [open, setOpen] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
// //   const term = value.trim();

// //   useEffect(() => {
// //     if (!term) {
// //       setSuggestions([]);
// //       setLoading(false);
// //       return;
// //     }

// //     setLoading(true);

// //     const timeout = setTimeout(() => {
// //       fetch(`/api/products?search=${encodeURIComponent(term)}&pageSize=6`)
// //         .then((res) => res.json())
// //         .then((data) => setSuggestions(data.success ? data.data : []))
// //         .catch(() => setSuggestions([]))
// //         .finally(() => setLoading(false));
// //     }, 300);

// //     return () => clearTimeout(timeout);
// //   }, [term]);

// //   useEffect(() => {
// //     function handleClickOutside(e: MouseEvent) {
// //       if (
// //         containerRef.current &&
// //         !containerRef.current.contains(e.target as Node)
// //       ) {
// //         setOpen(false);
// //       }
// //     }

// //     document.addEventListener("mousedown", handleClickOutside);

// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   function goToProduct(slug: string) {
// //     setOpen(false);
// //     onNavigate?.();
// //     router.push(`/product/${slug}`);
// //   }

// //   const showDropdown = open && term.length > 0;

// //   return (
// //     <div ref={containerRef} className="relative w-full">
// //       {/* Search Input */}
// //       <div className="flex items-stretch overflow-hidden rounded-lg border border-[#D5BBB3] bg-white focus-within:border-[#783F35] focus-within:ring-1 focus-within:ring-[#783F35]">
// //         <input
// //           type="search"
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           onFocus={() => setOpen(true)}
// //           placeholder="Search jewellery..."
// //           autoComplete="off"
// //           className="w-full min-w-0 border-0 bg-transparent px-4 py-2 text-sm text-[#2F211D] outline-none placeholder:text-[#9A8D86]"
// //         />

// //         <button
// //           type="submit"
// //           aria-label="Search"
// //           className="flex shrink-0 items-center justify-center bg-primary-500 px-4 text-white transition-colors hover:bg-primary-600"
// //         >
// //           <Search className="h-4.5 w-4.5" strokeWidth={2} />
// //         </button>
// //       </div>

// //       {/* Search Suggestions */}
// //       {showDropdown && (
// //         <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-96 overflow-y-auto rounded-xl border border-[#E8DDD2] bg-white py-1 shadow-xl">
// //           {loading ? (
// //             <p className="px-4 py-3 text-sm text-[#8A7C75]">Searching...</p>
// //           ) : suggestions.length === 0 ? (
// //             <p className="px-4 py-3 text-sm text-[#8A7C75]">
// //               No products found
// //             </p>
// //           ) : (
// //             <>
// //               {suggestions.map((p) => (
// //                 <button
// //                   key={p.id}
// //                   type="button"
// //                   onMouseDown={(e) => e.preventDefault()}
// //                   onClick={() => goToProduct(p.slug)}
// //                   className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#FBF6EE]"
// //                 >
// //                   <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#F7EFEC]">
// //                     {p.image && (
// //                       <Image
// //                         src={p.image}
// //                         alt=""
// //                         fill
// //                         sizes="40px"
// //                         className="object-cover"
// //                       />
// //                     )}
// //                   </span>

// //                   <span className="min-w-0 flex-1">
// //                     <span className="block truncate text-sm text-[#2F211D]">
// //                       {p.name}
// //                     </span>

// //                     <span className="block text-xs font-medium text-primary-600">
// //                       {formatPrice(p.price)}
// //                     </span>
// //                   </span>
// //                 </button>
// //               ))}

// //               <button
// //                 type="button"
// //                 onMouseDown={(e) => e.preventDefault()}
// //                 onClick={() => {
// //                   setOpen(false);
// //                   onSubmit();
// //                 }}
// //                 className="mt-1 block w-full border-t border-[#E8DDD2] px-3 py-2 text-left text-sm font-medium text-primary-600 transition-colors hover:bg-[#FBF6EE]"
// //               >
// //                 {`See all results for "${term}"`}
// //               </button>
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export function Header() {
// //   const { data: session, status } = useSession();
// //   const { totalCount } = useCart();
// //   const { totalCount: wishlistCount } = useWishlist();
// //   const router = useRouter();

// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [search, setSearch] = useState("");

// //   function handleSearch(e?: React.FormEvent) {
// //     e?.preventDefault();

// //     router.push(
// //       search ? `/jewellery?search=${encodeURIComponent(search)}` : "/jewellery",
// //     );

// //     setMobileOpen(false);
// //   }

// //   const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setCurrentAnnouncementIndex(
// //         (prevIndex) => (prevIndex + 1) % announcements.length,
// //       );
// //     }, 4000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <>
// //       {/* Announcement Bar */}
// //       <div className="relative h-8 overflow-hidden bg-primary-500 py-2 text-center text-xs font-medium tracking-wide text-white">
// //         {announcements.map((announcement, index) => (
// //           <div
// //             key={index}
// //             className={`absolute w-full transition-all duration-500 ease-in-out ${
// //               index === currentAnnouncementIndex
// //                 ? "translate-y-0 transform opacity-100"
// //                 : "-translate-y-full transform opacity-0"
// //             }`}
// //           >
// //             {announcement}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Main Header */}
// //       <header className="sticky top-0 z-40 border-b border-[#E8DDD2] bg-[#FBF6EE]/95 backdrop-blur">
// //         <div className="mx-auto flex max-w-7xl items-center gap-20 px-4 py-1 sm:px-6 lg:px-8">
// //           {/* Logo */}
// //           <Link href="/" className="me-5 shrink-0">
// //             <Logo iconSize={80} />
// //           </Link>

// //           {/* Desktop Navigation */}
// //           <nav className="hidden items-center gap-6 text-sm font-medium text-[#4F403B] lg:flex">
// //             {NAV_LINKS.map((link) => (
// //               <Link
// //                 key={link.href}
// //                 href={link.href}
// //                 className="transition-colors hover:text-primary-600"
// //               >
// //                 {link.label}
// //               </Link>
// //             ))}
// //           </nav>

// //           {/* Desktop Search */}
// //           <form
// //             onSubmit={handleSearch}
// //             className="ml-auto hidden max-w-2xl flex-1 items-center md:flex"
// //           >
// //             <SearchBox
// //               value={search}
// //               onChange={setSearch}
// //               onSubmit={handleSearch}
// //             />
// //           </form>

// //           {/* Actions */}
// //           <div className="ml-auto flex items-center gap-1 md:ml-0">
// //             {status === "authenticated" && <NotificationBell />}

// //             {/* Account */}
// //             {status === "authenticated" ? (
// //               <div className="group relative">
// //                 <button className="flex items-center gap-1.5 rounded-full p-2 text-sm font-medium text-[#4F403B] transition-colors hover:bg-[#F3E9C8] lg:border lg:border-[#E8DDD2] lg:p-1.5 lg:pl-1.5 lg:pr-3 lg:hover:border-[#D5BBB3] lg:hover:bg-[#FBF6EE]">
// //                   {session.user?.image ? (
// //                     // eslint-disable-next-line @next/next/no-img-element
// //                     <img
// //                       src={session.user.image}
// //                       alt=""
// //                       className="h-6 w-6 shrink-0 rounded-full object-cover"
// //                     />
// //                   ) : (
// //                     <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
// //                       <User className="h-3.5 w-3.5" strokeWidth={2} />
// //                     </span>
// //                   )}

// //                   <span className="hidden lg:inline">
// //                     {session.user?.name?.split(" ")[0]}
// //                   </span>

// //                   <ChevronDown
// //                     className="hidden h-3.5 w-3.5 text-[#8A7C75] lg:block"
// //                     strokeWidth={2}
// //                   />
// //                 </button>

// //                 {/* Account Dropdown */}
// //                 <div className="invisible absolute right-0 z-50 mt-1 w-48 rounded-xl border border-[#E8DDD2] bg-white py-1 shadow-xl opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
// //                   <Link
// //                     href="/account"
// //                     className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4F403B] transition-colors hover:bg-[#FBF6EE]"
// //                   >
// //                     <User
// //                       className="h-4 w-4 text-primary-500"
// //                       strokeWidth={1.8}
// //                     />
// //                     My Account
// //                   </Link>

// //                   <Link
// //                     href="/account/orders"
// //                     className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4F403B] transition-colors hover:bg-[#FBF6EE]"
// //                   >
// //                     <Package
// //                       className="h-4 w-4 text-primary-500"
// //                       strokeWidth={1.8}
// //                     />
// //                     My Orders
// //                   </Link>

// //                   {session.user?.role === "ADMIN" && (
// //                     <Link
// //                       href="/admin"
// //                       className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4F403B] transition-colors hover:bg-[#FBF6EE]"
// //                     >
// //                       <LayoutDashboard
// //                         className="h-4 w-4 text-primary-500"
// //                         strokeWidth={1.8}
// //                       />
// //                       Admin Dashboard
// //                     </Link>
// //                   )}

// //                   <button
// //                     onClick={() => signOut({ callbackUrl: "/" })}
// //                     className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
// //                   >
// //                     <LogOut className="h-4 w-4" strokeWidth={1.8} />
// //                     Sign out
// //                   </button>
// //                 </div>
// //               </div>
// //             ) : (
// //               <Link
// //                 href="/login"
// //                 className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[#4F403B] transition-colors hover:bg-[#F3E9C8] lg:block"
// //               >
// //                 Login
// //               </Link>
// //             )}

// //             {/* Wishlist */}
// //             <Link
// //               href="/wishlist"
// //               className="relative rounded-full p-2 text-[#5F504A] transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
// //               aria-label="Wishlist"
// //             >
// //               <Heart className="h-5 w-5" strokeWidth={1.75} />

// //               {wishlistCount > 0 && (
// //                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] font-bold text-white">
// //                   {wishlistCount > 9 ? "9+" : wishlistCount}
// //                 </span>
// //               )}
// //             </Link>

// //             {/* Cart */}
// //             <Link
// //               href="/cart"
// //               className="relative rounded-full p-2 text-[#5F504A] transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
// //               aria-label="Cart"
// //             >
// //               <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />

// //               {totalCount > 0 && (
// //                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] font-bold text-white">
// //                   {totalCount > 9 ? "9+" : totalCount}
// //                 </span>
// //               )}
// //             </Link>

// //             {/* Mobile Menu */}
// //             <button
// //               className="rounded-lg p-2 text-[#5F504A] transition-colors hover:bg-[#F3E9C8] hover:text-primary-600 lg:hidden"
// //               aria-label="Toggle menu"
// //               onClick={() => setMobileOpen((o) => !o)}
// //             >
// //               <Menu className="h-6 w-6" strokeWidth={1.8} />
// //             </button>
// //           </div>
// //         </div>

// //         {/* Mobile Navigation */}
// //         {mobileOpen && (
// //           <div className="border-t border-[#E8DDD2] bg-[#FBF6EE] px-4 py-3 lg:hidden">
// //             <form onSubmit={handleSearch} className="mb-3 flex md:hidden">
// //               <SearchBox
// //                 value={search}
// //                 onChange={setSearch}
// //                 onSubmit={handleSearch}
// //                 onNavigate={() => setMobileOpen(false)}
// //               />
// //             </form>

// //             <nav className="flex flex-col gap-1 text-sm font-medium text-[#4F403B]">
// //               {NAV_LINKS.map((link) => (
// //                 <Link
// //                   key={link.href}
// //                   href={link.href}
// //                   className="rounded-lg px-2 py-2 transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
// //                   onClick={() => setMobileOpen(false)}
// //                 >
// //                   {link.label}
// //                 </Link>
// //               ))}

// //               {status !== "authenticated" && (
// //                 <Link
// //                   href="/login"
// //                   className="rounded-lg px-2 py-2 transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
// //                   onClick={() => setMobileOpen(false)}
// //                 >
// //                   Login
// //                 </Link>
// //               )}
// //             </nav>
// //           </div>
// //         )}
// //       </header>
// //     </>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { useSession, signOut } from "next-auth/react";

// import {
//   Menu,
//   Search,
//   User,
//   ShoppingCart,
//   Heart,
//   ChevronDown,
//   ChevronRight,
//   LayoutDashboard,
//   Package,
//   LogOut,
// } from "lucide-react";

// import { useCart } from "@/context/CartContext";
// import { useWishlist } from "@/context/WishlistContext";
// import { NotificationBell } from "@/components/layout/NotificationBell";
// import { Logo } from "@/components/layout/Logo";
// import { formatPrice } from "@/lib/format";

// export const announcements = [
//   "100% Natural Diamonds - SGL Certified",
//   "Free Shipping All Over Nepal",
//   "BIS Hallmarked Gold | SGL Certified Diamonds",
// ];

// /* =========================================================
//    NORMAL NAVIGATION
//    Jewellery is NOT a category.
//    It remains a normal navigation item.
// ========================================================= */

// const NAV_LINKS = [
//   { id: "home", href: "/", label: "Home" },
//   { id: "jewellery", href: "/jewellery", label: "Jewellery" },
//   { id: "about", href: "/about", label: "About Us" },
//   { id: "contact", href: "/contact", label: "Contact" },
// ];

// /* =========================================================
//    CATEGORY TYPES
// ========================================================= */

// type Category = {
//   id: number | string;
//   name: string;
//   slug: string;
//   subcategories?: Category[];
//   children?: Category[];
// };

// /* =========================================================
//    PRODUCT SEARCH TYPES
// ========================================================= */

// type ProductSuggestion = {
//   id: number;
//   name: string;
//   slug: string;
//   price: number;
//   image: string | null;
// };

// /* =========================================================
//    SEARCH BOX
// ========================================================= */

// function SearchBox({
//   value,
//   onChange,
//   onSubmit,
//   onNavigate,
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   onSubmit: () => void;
//   onNavigate?: () => void;
// }) {
//   const router = useRouter();

//   const containerRef = useRef<HTMLDivElement>(null);

//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);

//   const term = value.trim();

//   useEffect(() => {
//     if (!term) {
//       setSuggestions([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     const timeout = setTimeout(() => {
//       fetch(`/api/products?search=${encodeURIComponent(term)}&pageSize=6`)
//         .then((res) => res.json())
//         .then((data) => {
//           setSuggestions(data.success ? data.data : []);
//         })
//         .catch(() => {
//           setSuggestions([]);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [term]);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   function goToProduct(slug: string) {
//     setOpen(false);
//     onNavigate?.();

//     router.push(`/product/${slug}`);
//   }

//   const showDropdown = open && term.length > 0;

//   return (
//     <div ref={containerRef} className="relative w-full">
//       {/* Search Input */}
//       <div className="flex items-stretch overflow-hidden rounded-lg border border-[#D5BBB3] bg-white focus-within:border-[#783F35] focus-within:ring-1 focus-within:ring-[#783F35]">
//         <input
//           type="search"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={() => setOpen(true)}
//           placeholder="Search jewellery..."
//           autoComplete="off"
//           className="w-full min-w-0 border-0 bg-transparent px-4 py-2 text-sm text-[#2F211D] outline-none placeholder:text-[#9A8D86]"
//         />

//         <button
//           type="submit"
//           aria-label="Search"
//           className="flex shrink-0 items-center justify-center bg-primary-500 px-4 text-white transition-colors hover:bg-primary-600"
//         >
//           <Search className="h-4.5 w-4.5" strokeWidth={2} />
//         </button>
//       </div>

//       {/* Search Suggestions */}
//       {showDropdown && (
//         <div className="absolute left-0 right-0 top-full z-[70] mt-1.5 max-h-96 overflow-y-auto rounded-xl border border-[#E8DDD2] bg-white py-1 shadow-xl">
//           {loading ? (
//             <p className="px-4 py-3 text-sm text-[#8A7C75]">Searching...</p>
//           ) : suggestions.length === 0 ? (
//             <p className="px-4 py-3 text-sm text-[#8A7C75]">
//               No products found
//             </p>
//           ) : (
//             <>
//               {suggestions.map((p) => (
//                 <button
//                   key={p.id}
//                   type="button"
//                   onMouseDown={(e) => e.preventDefault()}
//                   onClick={() => goToProduct(p.slug)}
//                   className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#FBF6EE]"
//                 >
//                   <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#F7EFEC]">
//                     {p.image && (
//                       <Image
//                         src={p.image}
//                         alt=""
//                         fill
//                         sizes="40px"
//                         className="object-cover"
//                       />
//                     )}
//                   </span>

//                   <span className="min-w-0 flex-1">
//                     <span className="block truncate text-sm text-[#2F211D]">
//                       {p.name}
//                     </span>

//                     <span className="block text-xs font-medium text-primary-600">
//                       {formatPrice(p.price)}
//                     </span>
//                   </span>
//                 </button>
//               ))}

//               <button
//                 type="button"
//                 onMouseDown={(e) => e.preventDefault()}
//                 onClick={() => {
//                   setOpen(false);
//                   onSubmit();
//                 }}
//                 className="mt-1 block w-full border-t border-[#E8DDD2] px-3 py-2 text-left text-sm font-medium text-primary-600 transition-colors hover:bg-[#FBF6EE]"
//               >
//                 See all results for "{term}"
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    CATEGORY DROPDOWN
// ========================================================= */

// function CategoriesDropdown({
//   categories,
//   loading,
// }: {
//   categories: Category[];
//   loading: boolean;
// }) {
//   const [open, setOpen] = useState(false);
//   const [openCategory, setOpenCategory] = useState<string | number | null>(
//     null,
//   );

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//         setOpenCategory(null);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   function getChildren(category: Category) {
//     return category.subcategories || category.children || [];
//   }

//   return (
//     <div ref={dropdownRef} className="relative">
//       {/* Categories Button */}
//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[#4F403B] transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
//       >
//         Categories
//         <ChevronDown
//           className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
//           strokeWidth={1.8}
//         />
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div className="absolute left-0 top-full z-[60] mt-2 w-72 rounded-xl border border-[#E8DDD2] bg-white p-2 shadow-xl">
//           {loading ? (
//             <div className="px-3 py-4 text-sm text-[#8A7C75]">
//               Loading categories...
//             </div>
//           ) : categories.length === 0 ? (
//             <div className="px-3 py-4 text-sm text-[#8A7C75]">
//               No categories found.
//             </div>
//           ) : (
//             <div className="max-h-[70vh] overflow-y-auto">
//               {categories.map((category) => {
//                 const children = getChildren(category);
//                 const hasChildren = children.length > 0;
//                 const isOpen = openCategory === category.id;

//                 return (
//                   <div key={category.id}>
//                     {/* Category */}
//                     <div className="flex items-center justify-between rounded-lg hover:bg-[#FBF6EE]">
//                       <Link
//                         href={`/jewellery?category=${encodeURIComponent(
//                           category.slug,
//                         )}`}
//                         onClick={() => {
//                           setOpen(false);
//                           setOpenCategory(null);
//                         }}
//                         className="flex-1 px-3 py-2.5 text-sm font-medium text-[#4F403B] hover:text-primary-600"
//                       >
//                         {category.name}
//                       </Link>

//                       {hasChildren && (
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setOpenCategory(isOpen ? null : category.id)
//                           }
//                           className="p-2 text-[#8A7C75] hover:text-primary-600"
//                           aria-label={`Toggle ${category.name}`}
//                         >
//                           <ChevronRight
//                             className={`h-4 w-4 transition-transform ${
//                               isOpen ? "rotate-90" : ""
//                             }`}
//                           />
//                         </button>
//                       )}
//                     </div>

//                     {/* Subcategories */}
//                     {hasChildren && isOpen && (
//                       <div className="mb-1 ml-3 border-l border-[#E8DDD2] pl-2">
//                         {children.map((subcategory) => {
//                           const nestedChildren = getChildren(subcategory);

//                           return (
//                             <div key={subcategory.id}>
//                               <Link
//                                 href={`/jewellery?category=${encodeURIComponent(
//                                   subcategory.slug,
//                                 )}`}
//                                 onClick={() => {
//                                   setOpen(false);
//                                   setOpenCategory(null);
//                                 }}
//                                 className="block rounded-md px-3 py-2 text-xs text-[#6F625D] transition-colors hover:bg-[#FBF6EE] hover:text-primary-600"
//                               >
//                                 {subcategory.name}
//                               </Link>

//                               {/* Optional third level */}
//                               {nestedChildren.length > 0 && (
//                                 <div className="ml-3 border-l border-[#E8DDD2] pl-2">
//                                   {nestedChildren.map((nested) => (
//                                     <Link
//                                       key={nested.id}
//                                       href={`/jewellery?category=${encodeURIComponent(
//                                         nested.slug,
//                                       )}`}
//                                       onClick={() => {
//                                         setOpen(false);
//                                         setOpenCategory(null);
//                                       }}
//                                       className="block rounded-md px-3 py-1.5 text-xs text-[#8A7C75] transition-colors hover:bg-[#FBF6EE] hover:text-primary-600"
//                                     >
//                                       {nested.name}
//                                     </Link>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    MAIN HEADER
// ========================================================= */

// export function Header() {
//   const { data: session, status } = useSession();

//   const { totalCount } = useCart();
//   const { totalCount: wishlistCount } = useWishlist();

//   const router = useRouter();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [search, setSearch] = useState("");

//   /* =======================================================
//      DYNAMIC CATEGORIES
//   ======================================================= */

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;

//     async function loadCategories() {
//       try {
//         setCategoriesLoading(true);

//         /*
//          * Change only this URL if your category API
//          * uses a different endpoint.
//          */
//         const response = await fetch("/api/categories", {
//           cache: "no-store",
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch categories");
//         }

//         const result = await response.json();

//         if (!mounted) return;

//         /*
//          * Supports:
//          *
//          * { success: true, data: [...] }
//          *
//          * OR
//          *
//          * { data: [...] }
//          *
//          * OR
//          *
//          * [...]
//          */
//         const categoryData = Array.isArray(result)
//           ? result
//           : Array.isArray(result?.data)
//             ? result.data
//             : [];

//         setCategories(categoryData);
//       } catch (error) {
//         console.error("Failed to load categories:", error);

//         if (mounted) {
//           setCategories([]);
//         }
//       } finally {
//         if (mounted) {
//           setCategoriesLoading(false);
//         }
//       }
//     }

//     loadCategories();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   function handleSearch(e?: React.FormEvent) {
//     e?.preventDefault();

//     router.push(
//       search ? `/jewellery?search=${encodeURIComponent(search)}` : "/jewellery",
//     );

//     setMobileOpen(false);
//   }

//   /* =======================================================
//      ANNOUNCEMENTS
//   ======================================================= */

//   const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentAnnouncementIndex(
//         (prevIndex) => (prevIndex + 1) % announcements.length,
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   /* =======================================================
//      MOBILE CATEGORY STATE
//   ======================================================= */

//   const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

//   const [mobileExpandedCategory, setMobileExpandedCategory] = useState<
//     string | number | null
//   >(null);

//   function getChildren(category: Category) {
//     return category.subcategories || category.children || [];
//   }

//   return (
//     <>
//       {/* =====================================================
//           ANNOUNCEMENT BAR
//       ===================================================== */}
//       <div className="relative h-8 overflow-hidden bg-primary-500 py-2 text-center text-xs font-medium tracking-wide text-white">
//         {announcements.map((announcement, index) => (
//           <div
//             key={index}
//             className={`absolute w-full transition-all duration-500 ease-in-out ${
//               index === currentAnnouncementIndex
//                 ? "translate-y-0 transform opacity-100"
//                 : "-translate-y-full transform opacity-0"
//             }`}
//           >
//             {announcement}
//           </div>
//         ))}
//       </div>

//       {/* =====================================================
//           MAIN HEADER
//       ===================================================== */}
//       <header className="sticky top-0 z-40 border-b border-[#E8DDD2] bg-[#FBF6EE]/95 backdrop-blur">
//         <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6 lg:gap-8 lg:px-8">
//           {/* =================================================
//               LOGO
//           ================================================= */}
//           <Link href="/" className="shrink-0">
//             <Logo iconSize={80} />
//           </Link>

//           {/* =================================================
//               DESKTOP NAVIGATION
//           ================================================= */}
//           <nav className="hidden items-center gap-2 text-sm font-medium text-[#4F403B] lg:flex">
//             {/* Normal navigation items */}
//             {NAV_LINKS.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="rounded-lg px-3 py-2 transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {/* Dynamic Categories */}
//             <CategoriesDropdown
//               categories={categories}
//               loading={categoriesLoading}
//             />
//           </nav>

//           {/* =================================================
//               DESKTOP SEARCH
//           ================================================= */}
//           <form
//             onSubmit={handleSearch}
//             className="ml-auto hidden max-w-2xl flex-1 items-center md:flex"
//           >
//             <SearchBox
//               value={search}
//               onChange={setSearch}
//               onSubmit={handleSearch}
//             />
//           </form>

//           {/* =================================================
//               ACTIONS
//           ================================================= */}
//           <div className="ml-auto flex items-center gap-1 md:ml-0">
//             {/* Notification */}
//             {status === "authenticated" && <NotificationBell />}

//             {/* =================================================
//                 ACCOUNT
//             ================================================= */}
//             {status === "authenticated" ? (
//               <div className="group relative">
//                 <button
//                   type="button"
//                   className="flex items-center gap-1.5 rounded-full p-2 text-sm font-medium text-[#4F403B] transition-colors hover:bg-[#F3E9C8] lg:border lg:border-[#E8DDD2] lg:p-1.5 lg:pl-1.5 lg:pr-3 lg:hover:border-[#D5BBB3] lg:hover:bg-[#FBF6EE]"
//                 >
//                   {session.user?.image ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img
//                       src={session.user.image}
//                       alt=""
//                       className="h-6 w-6 shrink-0 rounded-full object-cover"
//                     />
//                   ) : (
//                     <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
//                       <User className="h-3.5 w-3.5" strokeWidth={2} />
//                     </span>
//                   )}

//                   <span className="hidden lg:inline">
//                     {session.user?.name?.split(" ")[0]}
//                   </span>

//                   <ChevronDown
//                     className="hidden h-3.5 w-3.5 text-[#8A7C75] lg:block"
//                     strokeWidth={2}
//                   />
//                 </button>

//                 {/* Account Dropdown */}
//                 <div className="invisible absolute right-0 z-50 mt-1 w-48 rounded-xl border border-[#E8DDD2] bg-white py-1 shadow-xl opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
//                   <Link
//                     href="/account"
//                     className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4F403B] transition-colors hover:bg-[#FBF6EE]"
//                   >
//                     <User
//                       className="h-4 w-4 text-primary-500"
//                       strokeWidth={1.8}
//                     />
//                     My Account
//                   </Link>

//                   <Link
//                     href="/account/orders"
//                     className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4F403B] transition-colors hover:bg-[#FBF6EE]"
//                   >
//                     <Package
//                       className="h-4 w-4 text-primary-500"
//                       strokeWidth={1.8}
//                     />
//                     My Orders
//                   </Link>

//                   {session.user?.role === "ADMIN" && (
//                     <Link
//                       href="/admin"
//                       className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4F403B] transition-colors hover:bg-[#FBF6EE]"
//                     >
//                       <LayoutDashboard
//                         className="h-4 w-4 text-primary-500"
//                         strokeWidth={1.8}
//                       />
//                       Admin Dashboard
//                     </Link>
//                   )}

//                   <button
//                     type="button"
//                     onClick={() => signOut({ callbackUrl: "/" })}
//                     className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
//                   >
//                     <LogOut className="h-4 w-4" strokeWidth={1.8} />
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[#4F403B] transition-colors hover:bg-[#F3E9C8] lg:block"
//               >
//                 Login
//               </Link>
//             )}

//             {/* =================================================
//                 WISHLIST
//             ================================================= */}
//             <Link
//               href="/wishlist"
//               className="relative rounded-full p-2 text-[#5F504A] transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
//               aria-label="Wishlist"
//             >
//               <Heart className="h-5 w-5" strokeWidth={1.75} />

//               {wishlistCount > 0 && (
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] font-bold text-white">
//                   {wishlistCount > 9 ? "9+" : wishlistCount}
//                 </span>
//               )}
//             </Link>

//             {/* =================================================
//                 CART
//             ================================================= */}
//             <Link
//               href="/cart"
//               className="relative rounded-full p-2 text-[#5F504A] transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
//               aria-label="Cart"
//             >
//               <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />

//               {totalCount > 0 && (
//                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] font-bold text-white">
//                   {totalCount > 9 ? "9+" : totalCount}
//                 </span>
//               )}
//             </Link>

//             {/* =================================================
//                 MOBILE MENU BUTTON
//             ================================================= */}
//             <button
//               type="button"
//               className="rounded-lg p-2 text-[#5F504A] transition-colors hover:bg-[#F3E9C8] hover:text-primary-600 lg:hidden"
//               aria-label="Toggle menu"
//               onClick={() => setMobileOpen((o) => !o)}
//             >
//               <Menu className="h-6 w-6" strokeWidth={1.8} />
//             </button>
//           </div>
//         </div>

//         {/* =====================================================
//             MOBILE NAVIGATION
//         ===================================================== */}
//         {mobileOpen && (
//           <div className="border-t border-[#E8DDD2] bg-[#FBF6EE] px-4 py-3 lg:hidden">
//             {/* Mobile Search */}
//             <form onSubmit={handleSearch} className="mb-3 flex md:hidden">
//               <SearchBox
//                 value={search}
//                 onChange={setSearch}
//                 onSubmit={handleSearch}
//                 onNavigate={() => setMobileOpen(false)}
//               />
//             </form>

//             <nav className="flex flex-col gap-1 text-sm font-medium text-[#4F403B]">
//               {/* Normal Navigation */}
//               {NAV_LINKS.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}

//               {/* =================================================
//                   MOBILE CATEGORIES
//               ================================================= */}
//               <div className="mt-1 border-t border-[#E8DDD2] pt-1">
//                 <button
//                   type="button"
//                   onClick={() => setMobileCategoryOpen((prev) => !prev)}
//                   className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
//                 >
//                   <span>Categories</span>

//                   <ChevronDown
//                     className={`h-4 w-4 transition-transform ${
//                       mobileCategoryOpen ? "rotate-180" : ""
//                     }`}
//                     strokeWidth={1.8}
//                   />
//                 </button>

//                 {mobileCategoryOpen && (
//                   <div className="mt-1 rounded-lg border border-[#E8DDD2] bg-white p-1">
//                     {categoriesLoading ? (
//                       <p className="px-3 py-3 text-xs text-[#8A7C75]">
//                         Loading categories...
//                       </p>
//                     ) : categories.length === 0 ? (
//                       <p className="px-3 py-3 text-xs text-[#8A7C75]">
//                         No categories found.
//                       </p>
//                     ) : (
//                       categories.map((category) => {
//                         const children = getChildren(category);

//                         const isExpanded =
//                           mobileExpandedCategory === category.id;

//                         return (
//                           <div key={category.id}>
//                             {/* Category */}
//                             <div className="flex items-center">
//                               <Link
//                                 href={`/jewellery?category=${encodeURIComponent(
//                                   category.slug,
//                                 )}`}
//                                 onClick={() => setMobileOpen(false)}
//                                 className="flex-1 rounded-md px-3 py-2.5 text-sm text-[#4F403B] hover:bg-[#FBF6EE] hover:text-primary-600"
//                               >
//                                 {category.name}
//                               </Link>

//                               {children.length > 0 && (
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     setMobileExpandedCategory(
//                                       isExpanded ? null : category.id,
//                                     )
//                                   }
//                                   className="p-2 text-[#8A7C75]"
//                                 >
//                                   <ChevronRight
//                                     className={`h-4 w-4 transition-transform ${
//                                       isExpanded ? "rotate-90" : ""
//                                     }`}
//                                   />
//                                 </button>
//                               )}
//                             </div>

//                             {/* Subcategories */}
//                             {children.length > 0 && isExpanded && (
//                               <div className="mb-1 ml-4 border-l border-[#E8DDD2] pl-2">
//                                 {children.map((subcategory) => (
//                                   <Link
//                                     key={subcategory.id}
//                                     href={`/jewellery?category=${encodeURIComponent(
//                                       subcategory.slug,
//                                     )}`}
//                                     onClick={() => setMobileOpen(false)}
//                                     className="block rounded-md px-3 py-2 text-xs text-[#6F625D] hover:bg-[#FBF6EE] hover:text-primary-600"
//                                   >
//                                     {subcategory.name}
//                                   </Link>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Login */}
//               {status !== "authenticated" && (
//                 <Link
//                   href="/login"
//                   className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F3E9C8] hover:text-primary-600"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </nav>
//           </div>
//         )}
//       </header>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import {
  Menu,
  Search,
  User,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  LogOut,
  X,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Logo } from "@/components/layout/Logo";
import { formatPrice } from "@/lib/format";

export const announcements = [
  "100% Natural Diamonds - SGL Certified",
  "Free Shipping All Over Nepal",
  "BIS Hallmarked Gold | SGL Certified Diamonds",
];

/* -------------------------------------------------------
   NORMAL NAVIGATION
   Jewellery is NOT a category.
------------------------------------------------------- */

const NAV_LINKS = [
  { id: "home", href: "/", label: "Home" },
  { id: "jewellery", href: "/jewellery", label: "Jewellery" },
  { id: "about", href: "/about", label: "About Us" },
  { id: "contact", href: "/contact", label: "Contact" },
];

/* -------------------------------------------------------
   CATEGORY TYPES
------------------------------------------------------- */

// type Category = {
//   id: number | string;
//   name: string;
//   slug: string;
//   children?: Category[];
//   subcategories?: Category[];
//   subItems?: Category[];
// };
type Category = {
  id: number | string;
  name: string;
  slug: string;

  children?: Category[];
  subcategories?: Category[];
  subItems?: Category[];
};

type ProductSuggestion = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
};

/* -------------------------------------------------------
   SEARCH BOX
------------------------------------------------------- */

function SearchBox({
  value,
  onChange,
  onSubmit,
  onNavigate,
  selectedCategory,
  onCategoryChange,
  categories,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onNavigate?: () => void;

  selectedCategory: string;
  onCategoryChange: (value: string) => void;

  categories: Category[];
}) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);

  const term = value.trim();

  /* -------------------------------------------------------
     PRODUCT SEARCH SUGGESTIONS
  ------------------------------------------------------- */

  useEffect(() => {
    if (!term) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(term)}&pageSize=6`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(
            data?.success && Array.isArray(data?.data) ? data.data : [],
          );
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [term]);

  /* -------------------------------------------------------
     CLOSE SEARCH SUGGESTIONS
  ------------------------------------------------------- */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* -------------------------------------------------------
     PRODUCT NAVIGATION
  ------------------------------------------------------- */

  function goToProduct(slug: string) {
    setOpen(false);
    onNavigate?.();

    router.push(`/product/${slug}`);
  }

  const showDropdown = open && term.length > 0;

  /* -------------------------------------------------------
     CATEGORY OPTION
  ------------------------------------------------------- */

  // function renderCategoryOptions(
  //   items: Category[],
  //   level = 0,
  // ): React.ReactNode[] {
  //   const output: React.ReactNode[] = [];

  //   items.forEach((category) => {
  //     output.push(
  //       <option
  //         key={`${category.id}-${category.slug}-${level}`}
  //         value={category.slug}
  //       >
  //         {level > 0 ? `${"— ".repeat(level)}${category.name}` : category.name}
  //       </option>,
  //     );

  //     const children =
  //       category.children || category.subcategories || category.subItems || [];

  //     if (children.length > 0) {
  //       output.push(...renderCategoryOptions(children, level + 1));
  //     }
  //   });

  //   return output;
  // }
  function renderCategoryOptions(
    items: Category[],
    level = 0,
  ): React.ReactNode[] {
    const options: React.ReactNode[] = [];

    items.forEach((category) => {
      const prefix = level === 0 ? "" : `${"-".repeat(level)} `;

      options.push(
        <option key={`${category.id}-${level}`} value={category.slug}>
          {prefix}
          {category.name}
        </option>,
      );

      // Support different possible API property names
      const children =
        category.children || category.subcategories || category.subItems || [];

      if (children.length > 0) {
        options.push(...renderCategoryOptions(children, level + 1));
      }
    });

    return options;
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* =====================================================
          SEARCH + CATEGORY
          Connected UI
      ===================================================== */}

      <div
        className="
          flex
          h-11
          w-full
          items-stretch
          overflow-hidden
          rounded-lg
          border
          border-[#D5BBB3]
          bg-white
          shadow-sm
          transition-colors
          focus-within:border-[#783F35]
          focus-within:ring-1
          focus-within:ring-[#783F35]
        "
      >
        {/* Category Select */}

        <div className="relative shrink-0 border-r border-[#E8DDD2]">
          {/* <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="
              h-full
              w-[150px]
              cursor-pointer
              appearance-none
              bg-transparent
              pl-3
              pr-8
              text-xs
              font-medium
              text-[#4F403B]
              outline-none
              md:w-[175px]
              md:text-sm
            "
          >
            <option value="">All Categories</option>

            {renderCategoryOptions(categories)}
          </select> */}

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="
    h-full
    w-[150px]
    cursor-pointer
    appearance-none
    bg-transparent
    pl-3
    pr-8
    text-xs
    font-medium
    text-[#4F403B]
    outline-none
    md:w-[175px]
    md:text-sm
  "
          >
            <option value="">All Categories</option>

            {renderCategoryOptions(categories)}
          </select>

          <ChevronDown
            className="
              pointer-events-none
              absolute
              right-2.5
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-[#8A7C75]
            "
          />
        </div>

        {/* Search Input */}

        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search jewellery..."
          autoComplete="off"
          className="
            min-w-0
            flex-1
            border-0
            bg-transparent
            px-4
            py-2
            text-sm
            text-[#2F211D]
            outline-none
            placeholder:text-[#9A8D86]
          "
        />

        {/* Search Button */}

        <button
          type="submit"
          aria-label="Search"
          className="
            flex
            shrink-0
            items-center
            justify-center
            bg-primary-500
            px-4
            text-white
            transition-colors
            hover:bg-primary-600
          "
        >
          <Search className="h-4.5 w-4.5" strokeWidth={2} />
        </button>
      </div>

      {/* =====================================================
          SEARCH SUGGESTIONS
      ===================================================== */}

      {showDropdown && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-1.5
            max-h-96
            overflow-y-auto
            rounded-xl
            border
            border-[#E8DDD2]
            bg-white
            py-1
            shadow-xl
          "
        >
          {loading ? (
            <p className="px-4 py-3 text-sm text-[#8A7C75]">Searching...</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[#8A7C75]">
              No products found
            </p>
          ) : (
            <>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToProduct(product.slug)}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-3
                    py-2
                    text-left
                    transition-colors
                    hover:bg-[#FBF6EE]
                  "
                >
                  <span
                    className="
                      relative
                      h-10
                      w-10
                      shrink-0
                      overflow-hidden
                      rounded-md
                      bg-[#F7EFEC]
                    "
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-[#2F211D]">
                      {product.name}
                    </span>

                    <span className="block text-xs font-medium text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                  </span>
                </button>
              ))}

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  onSubmit();
                }}
                className="
                  mt-1
                  block
                  w-full
                  border-t
                  border-[#E8DDD2]
                  px-3
                  py-2
                  text-left
                  text-sm
                  font-medium
                  text-primary-600
                  transition-colors
                  hover:bg-[#FBF6EE]
                "
              >
                See all results for "{term}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

export function Header() {
  const { data: session, status } = useSession();

  const { totalCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();

  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  /* =======================================================
     FETCH CATEGORIES DYNAMICALLY
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const response = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const result = await response.json();

        /*
         Supports:

         {
           success: true,
           data: [...]
         }

         OR

         {
           data: [...]
         }

         OR

         [...]
        */

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.categories)
              ? result.categories
              : [];

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (!cancelled) {
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    const query = params.toString();

    router.push(query ? `/jewellery?${query}` : "/jewellery");

    setMobileOpen(false);
  }

  /* =======================================================
     ANNOUNCEMENT SLIDER
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex(
        (previous) => (previous + 1) % announcements.length,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* =======================================================
     MOBILE CATEGORY RENDER
  ======================================================= */

  function renderMobileCategories(
    items: Category[],
    level = 0,
  ): React.ReactNode[] {
    const output: React.ReactNode[] = [];

    items.forEach((category) => {
      output.push(
        <Link
          key={`${category.id}-${category.slug}-${level}`}
          href={`/jewellery?category=${category.slug}`}
          onClick={() => setMobileOpen(false)}
          className={`
            block
            rounded-md
            px-3
            py-2
            text-sm
            transition-colors
            hover:bg-[#F3E9C8]
            hover:text-primary-600
            ${
              level > 0
                ? "pl-7 text-xs text-[#6F625D]"
                : "font-medium text-[#4F403B]"
            }
          `}
        >
          {level > 0 && <span className="mr-1 text-[#B49B91]">—</span>}

          {category.name}
        </Link>,
      );

      const children =
        category.children || category.subcategories || category.subItems || [];

      if (children.length > 0) {
        output.push(...renderMobileCategories(children, level + 1));
      }
    });

    return output;
  }

  return (
    <>
      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}

      <div
        className="
          relative
          h-8
          overflow-hidden
          bg-primary-500
          py-2
          text-center
          text-xs
          font-medium
          tracking-wide
          text-white
        "
      >
        {announcements.map((announcement, index) => (
          <div
            key={index}
            className={`
                absolute
                w-full
                transition-all
                duration-500
                ease-in-out
                ${
                  index === currentAnnouncementIndex
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }
              `}
          >
            {announcement}
          </div>
        ))}
      </div>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-[#E8DDD2]
          bg-[#FBF6EE]/95
          backdrop-blur
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            gap-4
            px-4
            py-2
            sm:px-6
            lg:gap-8
            lg:px-8
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link href="/" className="shrink-0">
            <Logo iconSize={80} />
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
              
              Jewellery remains a normal nav item.
          ================================================= */}

          <nav
            className="
              hidden
              shrink-0
              items-center
              gap-5
              text-sm
              font-medium
              text-[#4F403B]
              lg:flex
            "
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  whitespace-nowrap
                  transition-colors
                  hover:text-primary-600
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* =================================================
              DESKTOP SEARCH

              CATEGORY + SEARCH are connected.
          ================================================= */}

          <form
            onSubmit={handleSearch}
            className="
              ml-auto
              hidden
              min-w-0
              max-w-2xl
              flex-1
              md:flex
            "
          >
            <SearchBox
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />
          </form>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
            {/* Notification */}

            {status === "authenticated" && <NotificationBell />}

            {/* =================================================
                ACCOUNT
            ================================================= */}

            {status === "authenticated" ? (
              <div className="group relative">
                <button
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    p-2
                    text-sm
                    font-medium
                    text-[#4F403B]
                    transition-colors
                    hover:bg-[#F3E9C8]
                    lg:border
                    lg:border-[#E8DDD2]
                    lg:p-1.5
                    lg:pl-1.5
                    lg:pr-3
                    lg:hover:border-[#D5BBB3]
                    lg:hover:bg-[#FBF6EE]
                  "
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      className="
                        h-6
                        w-6
                        shrink-0
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-primary-50
                        text-primary-600
                      "
                    >
                      <User className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  )}

                  <span className="hidden lg:inline">
                    {session.user?.name?.split(" ")[0]}
                  </span>

                  <ChevronDown
                    className="
                      hidden
                      h-3.5
                      w-3.5
                      text-[#8A7C75]
                      lg:block
                    "
                    strokeWidth={2}
                  />
                </button>

                {/* Account Dropdown */}

                <div
                  className="
                    invisible
                    absolute
                    right-0
                    z-50
                    mt-1
                    w-48
                    rounded-xl
                    border
                    border-[#E8DDD2]
                    bg-white
                    py-1
                    opacity-0
                    shadow-xl
                    transition-opacity
                    group-hover:visible
                    group-hover:opacity-100
                  "
                >
                  <Link
                    href="/account"
                    className="
                      flex
                      items-center
                      gap-2.5
                      px-4
                      py-2
                      text-sm
                      text-[#4F403B]
                      hover:bg-[#FBF6EE]
                    "
                  >
                    <User className="h-4 w-4 text-primary-500" />
                    My Account
                  </Link>

                  <Link
                    href="/account/orders"
                    className="
                      flex
                      items-center
                      gap-2.5
                      px-4
                      py-2
                      text-sm
                      text-[#4F403B]
                      hover:bg-[#FBF6EE]
                    "
                  >
                    <Package className="h-4 w-4 text-primary-500" />
                    My Orders
                  </Link>

                  {session.user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="
                        flex
                        items-center
                        gap-2.5
                        px-4
                        py-2
                        text-sm
                        text-[#4F403B]
                        hover:bg-[#FBF6EE]
                      "
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary-500" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                      })
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-2.5
                      px-4
                      py-2
                      text-left
                      text-sm
                      text-red-600
                      hover:bg-red-50
                    "
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="
                  hidden
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-[#4F403B]
                  hover:bg-[#F3E9C8]
                  lg:block
                "
              >
                Login
              </Link>
            )}

            {/* =================================================
                WISHLIST
            ================================================= */}

            <Link
              href="/wishlist"
              className="
                relative
                rounded-full
                p-2
                text-[#5F504A]
                transition-colors
                hover:bg-[#F3E9C8]
                hover:text-primary-600
              "
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" strokeWidth={1.75} />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-secondary-500
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* =================================================
                CART
            ================================================= */}

            <Link
              href="/cart"
              className="
                relative
                rounded-full
                p-2
                text-[#5F504A]
                transition-colors
                hover:bg-[#F3E9C8]
                hover:text-primary-600
              "
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />

              {totalCount > 0 && (
                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-secondary-500
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {totalCount > 9 ? "9+" : totalCount}
                </span>
              )}
            </Link>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              className="
                rounded-lg
                p-2
                text-[#5F504A]
                transition-colors
                hover:bg-[#F3E9C8]
                hover:text-primary-600
                lg:hidden
              "
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" strokeWidth={1.8} />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        {mobileOpen && (
          <div
            className="
              border-t
              border-[#E8DDD2]
              bg-[#FBF6EE]
              px-4
              py-3
              lg:hidden
            "
          >
            {/* Mobile Search */}

            <form onSubmit={handleSearch} className="mb-4">
              <SearchBox
                value={search}
                onChange={setSearch}
                onSubmit={handleSearch}
                onNavigate={() => setMobileOpen(false)}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
              />
            </form>

            {/* Normal Navigation */}

            <nav
              className="
                flex
                flex-col
                gap-1
                text-sm
                font-medium
                text-[#4F403B]
              "
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    rounded-lg
                    px-3
                    py-2.5
                    transition-colors
                    hover:bg-[#F3E9C8]
                    hover:text-primary-600
                  "
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* =================================================
                MOBILE DYNAMIC CATEGORIES
            ================================================= */}

            <div className="mt-4 border-t border-[#E8DDD2] pt-3">
              <div className="mb-2 flex items-center justify-between px-3">
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#8A7C75]
                  "
                >
                  Categories
                </p>

                {categoriesLoading && (
                  <span className="text-[10px] text-[#9A8D86]">Loading...</span>
                )}
              </div>

              {!categoriesLoading && categories.length === 0 && (
                <p className="px-3 py-2 text-xs text-[#8A7C75]">
                  No categories found
                </p>
              )}

              <div className="flex flex-col">
                {renderMobileCategories(categories)}
              </div>
            </div>

            {/* =================================================
                MOBILE LOGIN
            ================================================= */}

            {status !== "authenticated" && (
              <Link
                href="/login"
                className="
                  mt-3
                  block
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-[#4F403B]
                  hover:bg-[#F3E9C8]
                  hover:text-primary-600
                "
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
