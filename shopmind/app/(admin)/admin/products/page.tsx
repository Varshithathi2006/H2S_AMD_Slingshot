"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@prisma/client";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Inventory</h1>
                <p className="text-gray-500 font-medium">Manage your products and stock levels</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6 h-12 shadow-lg shadow-purple-500/20">
                <Plus className="w-5 h-5 mr-2" /> Add Product
            </Button>
        </div>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <div className="p-6 border-b bg-white">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search by name or category..." 
                        className="pl-10 h-11 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-20 text-gray-400">Loading products...</TableCell></TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-20 text-gray-400">No products found.</TableCell></TableRow>
                        ) : filteredProducts.map((p) => (
                            <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-gray-900">{p.name}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">
                                        {p.category}
                                    </span>
                                </TableCell>
                                <TableCell className="font-semibold text-purple-600">₹{p.price.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                                        <span className={p.stock < 10 ? "text-red-600 font-bold" : "text-gray-600"}>{p.stock}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-purple-600 hover:bg-purple-50">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ children, className }: any) {
    return <div className={`bg-white rounded-xl ${className}`}>{children}</div>
}
