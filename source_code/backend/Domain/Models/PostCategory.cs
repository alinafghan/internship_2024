using System;
using System.Collections.Generic;
using System.Data;
using Domain.Models;
using Microsoft.EntityFrameworkCore;


namespace Domain.Models;


public partial class postCategory
{
    public int CategoryId { get; set; }

    public int PostId { get; set; }

}