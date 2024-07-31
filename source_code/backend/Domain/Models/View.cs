﻿using System;
using System.Collections.Generic;

namespace Domain.Models;

public partial class View
{
    public int PostId { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
