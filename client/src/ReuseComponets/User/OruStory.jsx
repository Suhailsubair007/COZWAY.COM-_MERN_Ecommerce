import { useState } from "react";

export default function OurStory() {
  return (
    <section className="container mx-auto px-4 py-8 md:flex md:items-center md:justify-centre">
      <div className="md:w-1/2">
        <nav className="text-sm text-muted-foreground mb-4">Home / About</nav>
        <h1 className="text-4xl font-bold mb-4">Our Story</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to [Your Store Name], where cutting-edge technology meets
          seamless shopping. Since our launch in [Launch Date], we've been
          committed to offering the latest smartphones from top brands like
          Apple, Samsung, Xiaomi, OnePlus, and more. Our mission is to provide
          you with a diverse range of smartphones that cater to your performance
          needs, aesthetic preferences, and budget. Whether you're after the
          latest flagship with powerful cameras, sleek designs, or affordable
          yet feature-packed options, you'll find it all here. At [Your Store
          Name], we pride ourselves on quality products, competitive pricing,
          and exceptional customer service. Discover your next smartphone with
          us and experience the best in mobile technology.
        </p>
        <p className="text-muted-foreground">
          Exclusive has more than 1 Million products to offer, growing at a very
          fast pace. Exclusive offers a diverse assortment in categories ranging
          from consumer electronics to fashion.
        </p>
      </div>
      <div className="mt-8 md:mt-0 md:w-1/2 md:pl-8">
        <img
          src="https://res.cloudinary.com/dupo7yv88/image/upload/v1732169849/dp5_1_ummtk7.jpg"
          alt="Model in stylish clothing"
          width={450}
          height={550}
          className="rounded-lg border-2 border-blue-500"
        />
      </div>
    </section>
  );
}
