using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Synergy.Data;
using Synergy.Models;

namespace Synergy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeamsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            return Ok(await _context.Teams.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Team>> CreateTeam(Team team)
        {
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();
            return Ok(team);
        }
    }
}