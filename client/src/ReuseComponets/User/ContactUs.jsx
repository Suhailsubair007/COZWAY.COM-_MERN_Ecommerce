import { Mail, MapPin, Phone } from 'lucide-react'
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="container px-4 py-12 mx-auto max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div className="space-y-6" variants={itemVariants}>
            <div>
              <motion.h1 
                className="text-4xl font-bold tracking-tight"
                variants={itemVariants}
              >
                Contact Us
              </motion.h1>
              <motion.p 
                className="mt-2 text-lg text-muted-foreground"
                variants={itemVariants}
              >
                Get in touch with Cozway - Your Premium Men&apos;s Fashion Destination
              </motion.p>
            </div>
            <motion.div 
              className="relative h-[500px] overflow-hidden rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                alt="Cozway brand image"
                className="object-cover"
                fill
                src="https://res.cloudinary.com/dupo7yv88/image/upload/v1732515955/8ed0705c55574e61e2d81345c131c500458c7154_ghpoyc.avif"
              />
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Visit Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      123 Fashion Street
                      <br />
                      Style District
                      <br />
                      New York, NY 10001
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Call Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Mon-Fri: 9am - 6pm EST
                      <br />
                      Tel: (555) 123-4567
                      <br />
                      Toll Free: 1-800-COZWAY
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <motion.div className="grid gap-2" variants={itemVariants}>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your full name" required />
                  </motion.div>
                  <motion.div className="grid gap-2" variants={itemVariants}>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Your email address" required type="email" />
                  </motion.div>
                  <motion.div className="grid gap-2" variants={itemVariants}>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" required />
                  </motion.div>
                  <motion.div className="grid gap-2" variants={itemVariants}>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      className="min-h-[150px]"
                      id="message"
                      placeholder="How can we help you? Feel free to include any specific details."
                      required
                    />
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full" size="lg" type="submit">
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

