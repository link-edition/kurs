"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="flex-1 space-y-8 p-10 pt-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Sozlamalar</h2>
        <p className="text-zinc-400">Shaxsiy ma'lumotlaringiz va tizim moslamalari paneli.</p>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-zinc-900 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white">Profil Ma'lumotlari</CardTitle>
            <CardDescription className="text-zinc-400">
              Ushbu ma'lumotlar o'quvchilarga kurs muallifi sifatida ko'rinadi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Ism va Familiya</Label>
              <Input defaultValue="Asoschi Dasturchi" className="bg-zinc-950 border-white/10 text-white" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-300">Email pochta</Label>
              <Input defaultValue="admin@stitchlms.com" className="bg-zinc-950 border-white/10 text-white" disabled />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Kasbi (Title)</Label>
              <Input defaultValue="Senior Tech Instructor" className="bg-zinc-950 border-white/10 text-white" />
            </div>

            <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
              O'zgarishlarni saqlash
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
