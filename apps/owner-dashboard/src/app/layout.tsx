import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AnimatePresence, motion } from 'framer-motion'; // Import framer-motion
import { usePathname } from 'next/navigation'; // Import usePathname

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Owner Dashboard - Gasolinera JSM',
  description: 'Dashboard para propietarios de gasolineras',
};

const variants = {
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.1,
    },
  },
  out: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get current pathname

  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="root">
          <AnimatePresence mode="wait"> {/* Use AnimatePresence */}
            <motion.div
              key={pathname} // Key is crucial for AnimatePresence to detect route changes
              variants={variants}
              initial="out"
              animate="in"
              exit="out"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </body>
    </html>
  );
}