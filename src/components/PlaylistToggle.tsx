import { motion } from "framer-motion";
import { ListMusic } from "lucide-react";

interface PlaylistToggleProps {
  isPlaylist: boolean;
  onToggle: (value: boolean) => void;
}

const PlaylistToggle = ({ isPlaylist, onToggle }: PlaylistToggleProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(!isPlaylist)}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-widest border transition-all duration-200 ${
        isPlaylist
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
      }`}
    >
      <ListMusic className="w-4 h-4" />
      Playlist
    </motion.button>
  );
};

export default PlaylistToggle;
