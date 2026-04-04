using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Synergy.Data;        // ApplicationDbContext
using Synergy.Models;   // If your User entity is in a Models namespace

namespace Synergy.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/account
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AccountController(ApplicationDbContext db)
        {
            _db = db;
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class SignupDto
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // POST /api/account/signup
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if email already exists
            var existing = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existing != null)
            {
                return Conflict(new { message = "Email already in use." });
            }

            // NOTE: for a real app, hash the password before saving
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = dto.Password, // TODO: replace with proper hash
                Role = "Member"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }

        // POST /api/account/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Find user by email
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // For now compare directly; later replace with hash verification
            if (user.PasswordHash != dto.Password)
                return Unauthorized(new { message = "Invalid email or password." });

            // In a more advanced version you would create a row in "sessions"
            // and set a cookie. For now we just return the user details.
            return Ok(new
            {
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }

        // GET /api/account/session
        [HttpGet("session")]
        public IActionResult GetSession()
        {
            // Placeholder: no server-side session yet, so always "no session"
            return Unauthorized();
        }

        // POST /api/account/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Placeholder: if you add server-side sessions, clear them here
            return Ok();
        }
    }
}