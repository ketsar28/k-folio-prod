import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import PropTypes from 'prop-types';
import { 
  Alert02Icon, 
  Cancel01Icon, 
  Tick02Icon, 
  Delete02Icon 
} from "@hugeicons/core-free-icons";

/**
 * Custom Confirmation Modal to replace window.confirm
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Function to close the modal (cancel)
 * @param {function} onConfirm - Function to run on confirmation
 * @param {string} title - Modal title
 * @param {string} message - Modal message/description
 * @param {string} type - 'danger' (default) | 'info' | 'success'
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 */
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Konfirmasi", 
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?", 
  type = "danger",
  singleButton = false,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal"
}) => {
  // Config based on type
  const config = {
    danger: {
      color: "red",
      icon: Delete02Icon,
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-500",
      lightBg: "bg-red-500/10",
      hover: "hover:bg-red-600"
    },
    info: {
      color: "blue",
      icon: Alert02Icon,
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500",
      lightBg: "bg-blue-500/10",
      hover: "hover:bg-blue-600"
    },
    success: {
      color: "emerald",
      icon: Tick02Icon,
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-500",
      lightBg: "bg-emerald-500/10",
      hover: "hover:bg-emerald-600"
    },
    warning: {
      color: "amber",
      icon: Alert02Icon,
      bg: "bg-amber-500",
      text: "text-amber-500",
      border: "border-amber-500",
      lightBg: "bg-amber-500/10",
      hover: "hover:bg-amber-600"
    }
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl shadow-2xl p-6 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon Bubble */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${config.lightBg}`}>
                <HugeiconsIcon icon={config.icon} size={32} className={config.text} />
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">{message}</p>

              {/* Buttons */}
              <div className="flex gap-3 w-full">
                {!singleButton && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-medium text-sm"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={() => {
                    onConfirm();
                    if (singleButton) onClose();
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-colors ${config.bg} ${config.hover}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>

            {/* Close X */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-white"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'info', 'success', 'warning']),
  singleButton: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
};

export default ConfirmModal;
