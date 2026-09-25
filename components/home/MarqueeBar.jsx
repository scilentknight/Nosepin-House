export default function MarqueeBar() {
  return (
    <div className="bg-[#a82d60] py-2.5 overflow-hidden whitespace-nowrap border-y border-yellow-200 flex">
      <div className="animate-marquee whitespace-nowrap flex text-xs font-medium tracking-wide text-white w-max">
        {/* First Set */}
        <span className="mx-4">DOORSTEP CONVENIENCE</span>
        <span className="mx-4">EXCLUSIVE DEALS, POPULAR PICKS</span>
        <span className="mx-4">BEST PRODUCTS, BEST PRICES</span>
        <span className="mx-4">INSTANT REFRESH, FAST DELIVERY</span>
        <span className="mx-4">QUALITY, CONVENIENCE, QUICK DELIVERY!</span>
        <span className="mx-4">FREE SHIPPING</span>
        {/* Exact Duplicate for seamless loop */}
        <span className="mx-4">DOORSTEP CONVENIENCE</span>
        <span className="mx-4">EXCLUSIVE DEALS, POPULAR PICKS</span>
        <span className="mx-4">BEST PRODUCTS, BEST PRICES</span>
        <span className="mx-4">INSTANT REFRESH, FAST DELIVERY</span>
        <span className="mx-4">QUALITY, CONVENIENCE, QUICK DELIVERY!</span>
        <span className="mx-4">FREE SHIPPING</span>
      </div>
    </div>
  );
}
