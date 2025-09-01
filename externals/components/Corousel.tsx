
import { useState, useRef, useEffect } from "react";
import { cn } from "../utils/frontend";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface CarouselItem {
  background: string;
  content?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  noButton?: boolean;
  noNavigation?: boolean;

  /** Use custom class with: "item::", "prev-button::", "next-button::", "navigation::". */
  className?: string;
}

export default function Carousel({
  items,
  className = "",
  noButton,
  noNavigation,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length,
    );
  };

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      if (touchStartX.current - touchEndX.current > 50) handleNext();
      if (touchEndX.current - touchStartX.current > 50) handlePrev();
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(handleNext, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const styles = {
    base: cn("relative w-full overflow-hidden rounded-[6px]"),
    item: cn("flex-shrink-0 w-full aspect-[16/6] flex items-center justify-center bg-cover bg-center"),
    prevButton: cn("absolute top-1/2 left-4 transform -translate-y-1/2 bg-light-foreground/40 text-white p-2 rounded-[6px] cursor-pointer"),
    nextButton: cn("absolute top-1/2 right-4 transform -translate-y-1/2 bg-light-foreground/40 text-white p-2 rounded-[6px] cursor-pointer"),
    navigation: cn("absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"),
  };

  return (
    <div className={styles.base}>
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.item}
            style={{ backgroundImage: `url(${item.background})` }}
          >
            {item.content}
          </div>
        ))}
      </div>

      {!noNavigation && (
        <div className={styles.navigation}>
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-1 rounded-full ${currentIndex === index ? "bg-primary" : "bg-light-foreground/40"
                }`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      )}

      {!noButton && (
        <>
          <button className={styles.prevButton} onClick={handlePrev}>
            <CaretLeft />
          </button>
          <button className={styles.nextButton} onClick={handleNext}>
            <CaretRight />
          </button>
        </>
      )}
    </div>
  );
}
