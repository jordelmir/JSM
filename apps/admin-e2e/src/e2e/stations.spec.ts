import { test, expect } from '@playwright/test';

test.describe('Gestión de Estaciones', () => {
  test.beforeEach(async ({ page }) => {
    // Asumiendo que ya existe un usuario admin para pruebas
    await page.goto('/login');
    // Use environment variables for admin test credentials
    // Example: process.env.ADMIN_USER_EMAIL, process.env.ADMIN_USER_PASSWORD
    await page.getByLabel('Correo Electrónico').fill(process.env.ADMIN_USER_EMAIL || 'admin@puntog.com');
    await page.getByLabel('Contraseña').fill(process.env.ADMIN_USER_PASSWORD || 'admin123');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('debería permitir a un admin crear una nueva estación', async ({ page }) => {
    await page.getByRole('link', { name: 'Estaciones' }).click();
    await expect(page).toHaveURL('/dashboard/stations');

    await page.getByRole('button', { name: 'Añadir Nueva Estación' }).click();
    await expect(page.getByRole('heading', { name: 'Crear Nueva Estación' })).toBeVisible();

    const stationName = `Estación Test ${Date.now()}`;
    await page.getByLabel('Nombre de la Estación').fill(stationName);
    await page.getByLabel('Latitud').fill('10.000');
    await page.getByLabel('Longitud').fill('-84.000');

    await page.getByRole('button', { name: 'Guardar Estación' }).click();

    // Verificar que la estación aparece en la tabla
    await expect(page.getByText(stationName)).toBeVisible();
    await expect(page.getByText('ACTIVA')).toBeVisible();
  });

  // Podríamos añadir más tests aquí para editar, eliminar, filtrar, etc.
});