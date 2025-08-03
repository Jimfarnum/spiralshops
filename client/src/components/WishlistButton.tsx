import { useState } from "react";
import axios from "axios";

interface WishlistButtonProps {
  productId: string;
  shopperId: string;
}

function WishlistButton({ productId, shopperId }: WishlistButtonProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    const res = await axios.post("/api/wishlist/add", {
      shopperId,
      productId,
      alertPreferences: { priceDrop: true, restock: true },
    });
    if (res.data.success) setAdded(true);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className="bg-pink-600 text-white px-2 py-1 rounded text-sm"
    >
      {added ? "✔ Saved" : "♡ Wishlist"}
    </button>
  );
}

export default WishlistButton;