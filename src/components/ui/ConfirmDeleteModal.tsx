import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";

interface ConfirmDeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmDeleteModal({
  show,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <Modal
      size="sm"
      show={show}
      onHide={loading ? undefined : onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body
        className="text-center text-white"
        style={{ backgroundColor: "#232321", borderRadius: "5px" }}
      >
        <PiWarningCircle size={65} className="text-warning mb-2" />
        <p className="fw-bold">¿Eliminar publicación?</p>
        <p className="text-muted small">Esta acción no se puede deshacer.</p>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            style={{ backgroundColor: "#D76F25", borderColor: "#D76F25" }}
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
            className="d-flex align-items-center text-white"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />{" "}
                Eliminando...
              </>
            ) : (
              <>
                <FaTrash className="me-1" /> Eliminar
              </>
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
