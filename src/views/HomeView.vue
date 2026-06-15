<template>
  <section class="hero-section text-light">
    <div class="container py-5">
      <div class="row align-items-center min-vh-50 g-5">
        <div class="col-lg-7">
          <span class="badge text-bg-light mb-3">Nueva temporada</span>
          <h1 class="display-4 fw-bold">UrbanStyle viste tu ritmo urbano.</h1>
          <p class="lead text-white-75 mt-3">
            Descubre prendas modernas, cómodas y versátiles para crear looks con personalidad.
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3 mt-4">
            <RouterLink class="btn btn-light btn-lg" to="/catalogo">Comprar ahora</RouterLink>
            
            <RouterLink class="btn btn-outline-light btn-lg" to="/registro">Crear cuenta</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="container py-5">
    <div class="row g-4 text-center">
      <div class="col-md-4">
        <div class="feature-card p-4 h-100">
          <h2 class="h5 fw-bold">Estilo urbano</h2>
          <p class="text-secondary mb-0">Colecciones casuales, streetwear y esenciales para combinar a diario.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="feature-card p-4 h-100">
          <h2 class="h5 fw-bold">CRUD completo</h2>
          <p class="text-secondary mb-0">Crea, edita y elimina productos y usuarios desde paneles protegidos.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="feature-card p-4 h-100">
          <h2 class="h5 fw-bold">Compra fácil</h2>
          <p class="text-secondary mb-0">Añade productos al carrito y valida credenciales con servicios preparados para MockAPI.</p>
        </div>
      </div>
    </div>
  </section>
</template>
