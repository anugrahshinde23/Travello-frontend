function showToast(type, message) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: true,
      timer: 3000,
    });
  }