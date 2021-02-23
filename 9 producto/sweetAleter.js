import TextField from '@material-ui/core/TextField'
Swal.fire({
  title: '¿Cambiar a efectivo?',
  text: "¿Estas seguro de cambiar el método de cobro de la orden a efectivo? Esta acción no se podrá deshacer y deberás cobrar en efectivo.",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#1890ff',
  confirmButtonText: 'Si, cambiar a efectivo',
  cancelButtonColor: '#d33', 
  cancelButtonText: 'Cancelar',
}).then((result) => {
  if (result.value) {
    Swal.fire({
        title: 'Método de pago aceptado',
        text: "Has cambiado la orden a efectivo",
        icon: 'success',
        confirmButtonColor: '#1890ff',
        confirmButtonText: 'Continuar',
    })
  }
}) 