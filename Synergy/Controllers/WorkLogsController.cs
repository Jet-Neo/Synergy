using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Synergy.Data;
using Synergy.Models;

namespace Synergy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WorkLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkLog>>> GetWorkLogs()
        {
            var logs = await _context.WorkLogs
                .Include(w => w.Task)
                .Include(w => w.User)
                .ToListAsync();

            return Ok(logs);
        }

        [HttpPost]
        public async Task<ActionResult<WorkLog>> CreateWorkLog(WorkLog workLog)
        {
            _context.WorkLogs.Add(workLog);
            await _context.SaveChangesAsync();

            return Ok(workLog);
        }
    }
}